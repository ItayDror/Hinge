import { useMemo, useState } from 'react'
import { ProfileCard } from '../../components/ProfileCard'
import { SpacePromoCard } from './SpacePromoCard'
import { MOCK_PROFILES } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

type DeckItem = { kind: 'profile'; index: number } | { kind: 'promo'; spaceIndex: number }

export function DiscoverScreen() {
  const { spaces, push, dailyQuestion, showDailyInterstitial, showToast } = useAppState()
  const [cursor, setCursor] = useState(0)

  const deck = useMemo<DeckItem[]>(() => {
    const items: DeckItem[] = []
    let spaceCursor = 0
    MOCK_PROFILES.forEach((_, i) => {
      items.push({ kind: 'profile', index: i })
      // In-feed Space promo card every 5th card (within PRD's 4-6 range)
      if ((i + 1) % 5 === 0 && spaces.length > 0) {
        items.push({ kind: 'promo', spaceIndex: spaceCursor % spaces.length })
        spaceCursor += 1
      }
    })
    return items
  }, [spaces.length])

  const current = deck[cursor]
  const showDailyChip = !showDailyInterstitial && !dailyQuestion.answeredToday

  const advance = () => setCursor((c) => Math.min(c + 1, deck.length))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center justify-between px-5 pb-2 pt-1">
        <span className="text-[22px] font-black tracking-tight text-hinge-black">hinge</span>
        <div className="flex items-center gap-3 text-hinge-black">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </header>

      {showDailyChip && (
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={() => showToast('Opening today’s question…')}
            className="w-full rounded-pill bg-hinge-grey-bg px-4 py-2 text-left text-[13px] font-semibold text-hinge-grey"
          >
            🔥 Today's question is waiting — tap to answer
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 px-5 pb-3">
        {current ? (
          <div className="h-full">
            {current.kind === 'profile' ? (
              (() => {
                const profile = MOCK_PROFILES[current.index]
                const sharedSpace = profile.sharedSpaceId ? spaces.find((s) => s.id === profile.sharedSpaceId) : undefined
                return (
                  <ProfileCard
                    photoUrl={profile.photoUrl}
                    name={profile.name}
                    age={profile.age}
                    promptQuestion={profile.prompt.question}
                    promptAnswer={profile.prompt.answer}
                    sharedSpaceLabel={sharedSpace ? `${sharedSpace.emoji} Also in ${sharedSpace.title}` : undefined}
                  />
                )
              })()
            ) : (
              <SpacePromoCard
                space={spaces[current.spaceIndex]}
                onPeek={() => push({ screen: 'space-detail', params: { spaceId: spaces[current.spaceIndex].id } })}
              />
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-[17px] font-bold text-hinge-black">You're all caught up</p>
            <p className="text-body text-hinge-grey">Check back later for more people nearby.</p>
          </div>
        )}
      </div>

      {current && (
        <div className="flex shrink-0 items-center justify-center gap-6 px-5 pb-4">
          <button
            type="button"
            onClick={advance}
            aria-label="Pass"
            className="flex h-14 w-14 items-center justify-center rounded-pill bg-hinge-grey-bg text-hinge-grey shadow-card"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={advance}
            aria-label="Like"
            className="flex h-14 w-14 items-center justify-center rounded-pill bg-hinge-accent text-hinge-white shadow-card"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
