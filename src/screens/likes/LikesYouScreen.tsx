import { useState } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { AccentButton } from '../../components/AccentButton'
import { SpeechBubbleTag } from '../../components/SpeechBubbleTag'
import { SortSheet, type LikesSort } from '../../components/SortSheet'
import { UpgradeBanner } from '../../components/UpgradeBanner'
import { PremiumSheet } from '../spaces/PremiumSheet'
import { MOCK_LIKES, personById, portraitCard, type MockLike } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

// Likes You in the real Hinge presentation: big white cards with a
// speech-bubble context tag — which maps perfectly onto our two like types
// ("Liked your photo" vs "Liked your answer in <space>").
export function LikesYouScreen() {
  const { spaces, showToast, unlockPremium, premiumUnlocked } = useAppState()
  const [selected, setSelected] = useState<MockLike | null>(null)
  const [sortOpen, setSortOpen] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [sort, setSort] = useState<LikesSort>('all')

  const spaceById = (id?: string) => (id ? spaces.find((s) => s.id === id) : undefined)
  const likes = sort === 'from-spaces' ? MOCK_LIKES.filter((l) => l.type === 'space') : MOCK_LIKES

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1">
      <div className="flex items-center justify-between">
        <h1 className="text-screen-title text-hinge-black">Likes You</h1>
        <button
          type="button"
          onClick={() => showToast('Boost is not part of this prototype 😌')}
          className="flex items-center gap-1.5 rounded-pill bg-hinge-sage px-4 py-2.5 text-[14px] font-bold text-hinge-black"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
          </svg>
          Boost
        </button>
      </div>

      <button
        type="button"
        onClick={() => setSortOpen(true)}
        className="mt-4 rounded-pill border border-hinge-grey-light bg-hinge-white px-4 py-2 text-[14px] font-semibold text-hinge-black"
      >
        {sort === 'from-spaces' ? 'From Spaces' : sort === 'your-type' ? 'Your type' : 'Recent'} ⌄
      </button>

      <div className="mt-4 flex flex-col gap-4">
        {likes.map((like) => {
          const person = personById(like.personId)
          const space = spaceById(like.spaceId)
          return (
            <button
              key={like.id}
              type="button"
              onClick={() => setSelected(like)}
              className="rounded-card bg-hinge-white p-4 text-left shadow-card"
            >
              <SpeechBubbleTag
                text={space ? `Liked your answer in ${space.title} ${space.emoji}` : 'Liked your photo'}
              />
              <p className="mb-3 mt-3 text-[22px] font-bold text-hinge-black">{person.name}</p>
              <img
                src={portraitCard(person)}
                alt={person.name}
                className="aspect-[4/5] w-full rounded-[12px] object-cover"
              />
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <UpgradeBanner
          copy={premiumUnlocked ? 'You have Hinge+ — every Space is unlocked.' : 'With Hinge+, get your profile seen sooner'}
          onUpgrade={() => setPaywallOpen(true)}
        />
      </div>

      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        current={sort}
        onApply={setSort}
        onLockedTap={() => {
          setSortOpen(false)
          setPaywallOpen(true)
        }}
      />
      <PremiumSheet open={paywallOpen} onClose={() => setPaywallOpen(false)} onUpgrade={unlockPremium} />

      {selected &&
        (() => {
          const person = personById(selected.personId)
          const space = spaceById(selected.spaceId)
          return (
            <BottomSheet open onClose={() => setSelected(null)}>
              <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <div className="h-52 w-44 overflow-hidden rounded-card shadow-card">
                  <img src={portraitCard(person)} alt={person.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-[22px] font-bold text-hinge-black">
                  {person.name}, {person.age}
                </p>
                {space && selected.likedAnswerText ? (
                  <div className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
                    <p className="text-caption font-semibold text-hinge-accent">
                      {space.emoji} Liked your answer in {space.title}
                    </p>
                    <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">
                      “{selected.likedAnswerText}”
                    </p>
                  </div>
                ) : (
                  <div className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
                    <p className="text-[14px] font-semibold text-hinge-black">{person.prompt.question}</p>
                    <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">{person.prompt.answer}</p>
                  </div>
                )}
                <AccentButton
                  label="Match back 💌"
                  fullWidth
                  onClick={() => {
                    showToast(`It's a match with ${person.name}! 🎉`)
                    setSelected(null)
                  }}
                />
              </div>
            </BottomSheet>
          )
        })()}
    </div>
  )
}
