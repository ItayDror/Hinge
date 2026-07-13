import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { BottomSheet } from '../../components/BottomSheet'
import { AccentButton } from '../../components/AccentButton'
import { MOCK_LIKES, personById, portraitAvatar, portraitCard, type MockLike } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

// Likes You now distinguishes two like types: a regular profile like vs a
// "Like from Spaces" — someone who liked one of MY daily-question answers,
// shown with the space badge and the answer they liked quoted for context.
export function LikesYouScreen() {
  const { spaces, showToast } = useAppState()
  const [selected, setSelected] = useState<MockLike | null>(null)

  const spaceById = (id?: string) => (id ? spaces.find((s) => s.id === id) : undefined)

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1">
      <h1 className="text-screen-title text-hinge-black">Likes You</h1>
      <p className="mt-0.5 text-body text-hinge-grey">{MOCK_LIKES.length} people like you</p>

      <div className="mt-4 flex flex-col">
        {MOCK_LIKES.map((like) => {
          const person = personById(like.personId)
          const space = spaceById(like.spaceId)
          return (
            <button
              key={like.id}
              type="button"
              onClick={() => setSelected(like)}
              className="flex items-center gap-3 border-b border-hinge-grey-light py-3 text-left last:border-b-0"
            >
              <span className="relative inline-flex">
                <Avatar name={person.name} photoUrl={portraitAvatar(person)} size="lg" />
                {space && (
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-pill bg-hinge-white text-[13px] shadow-card">
                    {space.emoji}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-bold text-hinge-black">
                    {person.name}, {person.age}
                  </p>
                  {space ? (
                    <span className="rounded-pill bg-hinge-accent-soft px-2 py-0.5 text-[10px] font-bold text-hinge-accent">
                      From Spaces
                    </span>
                  ) : (
                    <span className="rounded-pill bg-hinge-grey-bg px-2 py-0.5 text-[10px] font-bold text-hinge-grey">
                      Liked you
                    </span>
                  )}
                </div>
                <p className="truncate text-caption text-hinge-grey">
                  {space ? `Liked your answer in ${space.title}` : `Liked your profile`}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {selected &&
        (() => {
          const person = personById(selected.personId)
          const space = spaceById(selected.spaceId)
          return (
            <BottomSheet open onClose={() => setSelected(null)}>
              <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <div className="h-48 w-40 overflow-hidden rounded-card shadow-card">
                  <img src={portraitCard(person)} alt={person.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-[20px] font-bold text-hinge-black">
                  {person.name}, {person.age}
                </p>
                {space && selected.likedAnswerText ? (
                  <div className="w-full rounded-card bg-hinge-accent-soft p-3 text-left">
                    <p className="text-caption font-semibold text-hinge-accent">
                      {space.emoji} Liked your answer in {space.title}
                    </p>
                    <p className="mt-1 text-body text-hinge-black">“{selected.likedAnswerText}”</p>
                  </div>
                ) : (
                  <div className="w-full rounded-card bg-hinge-grey-bg p-3 text-left">
                    <p className="text-prompt-q text-hinge-grey">{person.prompt.question}</p>
                    <p className="mt-0.5 text-[17px] text-hinge-black">{person.prompt.answer}</p>
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
