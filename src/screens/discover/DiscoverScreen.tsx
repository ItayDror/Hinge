import { useMemo, useState } from 'react'
import { PhotoCard } from '../../components/ProfileCard'
import { PromptCard } from '../../components/PromptCard'
import { VitalsCard } from '../../components/VitalsCard'
import { FilterBar } from '../../components/FilterBar'
import { CircleButton, XIcon } from '../../components/CircleButton'
import { SpacePromoCard } from './SpacePromoCard'
import { MOCK_PROFILES } from '../../data/mockData'
import { personById } from '../../data/people'
import { useAppState } from '../../state/AppStateContext'

type DeckItem = { kind: 'profile'; index: number } | { kind: 'promo'; spaceIndex: number }

/** Second photo of the same person — different crop of the same portrait. */
function secondPhoto(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=600&h=750&fit=crop&crop=entropy&auto=format`
}

export function DiscoverScreen() {
  const { spaces, push, dailyQuestion, showDailyInterstitial, reopenDailyInterstitial, showToast, premiumUnlocked } =
    useAppState()
  const [cursor, setCursor] = useState(0)

  // Only promote spaces the user can actually enter (locked ones live on the
  // Hinge+ shelf, not in the deck).
  const promoSpaces = useMemo(() => spaces.filter((s) => !s.premium || premiumUnlocked), [spaces, premiumUnlocked])

  const deck = useMemo<DeckItem[]>(() => {
    const items: DeckItem[] = []
    let spaceCursor = 0
    MOCK_PROFILES.forEach((_, i) => {
      items.push({ kind: 'profile', index: i })
      // In-feed Space promo card every 5th card (within PRD's 4-6 range)
      if ((i + 1) % 5 === 0 && promoSpaces.length > 0) {
        items.push({ kind: 'promo', spaceIndex: spaceCursor % promoSpaces.length })
        spaceCursor += 1
      }
    })
    return items
  }, [promoSpaces.length])

  const current = deck[cursor]
  const showDailyChip = !showDailyInterstitial && !dailyQuestion.answeredToday

  const advance = () => setCursor((c) => Math.min(c + 1, deck.length))
  const like = (name: string) => {
    showToast(`Like sent to ${name} 💌`)
    advance()
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <FilterBar />

      {showDailyChip && (
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={reopenDailyInterstitial}
            className="w-full rounded-pill bg-hinge-accent-soft px-4 py-2 text-left text-[13px] font-semibold text-hinge-accent"
          >
            Today's question is waiting — tap to answer
          </button>
        </div>
      )}

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-28">
        {current ? (
          current.kind === 'profile' ? (
            (() => {
              const profile = MOCK_PROFILES[current.index]
              const person = personById(profile.personId)
              const sharedSpace = profile.sharedSpaceId ? spaces.find((s) => s.id === profile.sharedSpaceId) : undefined
              return (
                <div key={profile.id} className="flex flex-col gap-3">
                  {/* Name header — outside the photo, like the real app */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h1 className="text-profile-name text-hinge-black">{profile.name}</h1>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--hinge-accent)">
                          <path d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-4 text-hinge-black">
                        <button type="button" aria-label="Undo" onClick={() => setCursor((c) => Math.max(0, c - 1))}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 14 4 9l5-5M4 9h9a7 7 0 1 1 0 14h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button type="button" aria-label="More options">•••</button>
                      </div>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-hinge-accent">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--hinge-accent)">
                        <path d="m12 1.7 2.4 2 3.1-.4 1.2 2.9 2.9 1.2-.4 3.1 2 2.4-2 2.4.4 3.1-2.9 1.2-1.2 2.9-3.1-.4-2.4 2-2.4-2-3.1.4-1.2-2.9-2.9-1.2.4-3.1-2-2.4 2-2.4-.4-3.1 2.9-1.2 1.2-2.9 3.1.4 2.4-2Z" />
                        <path d="m8.8 12.1 2.2 2.2 4.2-4.6" stroke="white" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Verified
                    </p>
                    {sharedSpace && (
                      <span className="mt-2 inline-block rounded-pill bg-hinge-accent-soft px-3 py-1 text-[12px] font-bold text-hinge-accent">
                        {sharedSpace.emoji} Also in {sharedSpace.title}
                      </span>
                    )}
                  </div>

                  <PhotoCard photoUrl={profile.photoUrl} alt={profile.name} onHeart={() => like(profile.name)} />

                  <PromptCard
                    question={profile.prompt.question}
                    answer={profile.prompt.answer}
                    onHeart={() => like(profile.name)}
                  />

                  <VitalsCard person={person} />

                  <PhotoCard photoUrl={secondPhoto(person.photoId)} alt={profile.name} onHeart={() => like(profile.name)} />
                </div>
              )
            })()
          ) : (
            <div key={`promo-${current.spaceIndex}`} className="pt-2">
              <SpacePromoCard
                space={promoSpaces[current.spaceIndex]}
                onPeek={() => push({ screen: 'space-detail', params: { spaceId: promoSpaces[current.spaceIndex].id } })}
                onSkip={advance}
              />
            </div>
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-[17px] font-bold text-hinge-black">You're all caught up</p>
            <p className="text-body text-hinge-grey">Check back later for more people nearby.</p>
          </div>
        )}
      </div>

      {/* Floating pass button — real Hinge places the X bottom-left over content */}
      {current && current.kind === 'profile' && (
        <div className="absolute bottom-4 left-5 z-20">
          <CircleButton ariaLabel="Pass" size="lg" onClick={advance}>
            <XIcon size={26} />
          </CircleButton>
        </div>
      )}
    </div>
  )
}
