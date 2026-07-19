import { BottomSheet } from '../../components/BottomSheet'
import { Avatar } from '../../components/Avatar'
import { personById, portraitAvatar } from '../../data/people'
import type { SpaceAnswer } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

interface ThreeMatchSheetProps {
  open: boolean
  onClose: () => void
  spaceTitle: string
  spaceId: string
  candidates: SpaceAnswer[] // top 3 answers by other people
  onOpenPerson: (personId: string, answerId: string, answerText: string) => void
}

// Offered on top of the daily question, not instead of it: after you answer,
// Hinge surfaces 3 people whose answers resonate with yours. Liking an answer
// engages (unlocks) that person; tapping them then pops their full profile.
export function ThreeMatchSheet({ open, onClose, spaceTitle, spaceId, candidates, onOpenPerson }: ThreeMatchSheetProps) {
  const { engagedPeople, likeSpaceAnswer } = useAppState()

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pb-2 text-center">
        <span className="text-[28px]">✨</span>
        <p className="mt-1 text-[20px] font-bold text-hinge-black">3 people whose answers click with yours</p>
        <p className="mt-0.5 text-caption text-hinge-grey">
          Based on your answer in {spaceTitle} · like an answer, then tap to view their profile
        </p>
      </div>
      <div className="flex flex-col gap-2.5 pb-2">
        {candidates.map((answer) => {
          const person = personById(answer.personId)
          const engaged = engagedPeople.includes(person.id)
          return (
            <div key={answer.id} className="flex items-start gap-3 rounded-card border border-hinge-grey-light bg-hinge-white p-3">
              <button
                type="button"
                onClick={() => onOpenPerson(person.id, answer.id, answer.text)}
                className="flex min-w-0 flex-1 items-start gap-3 text-left"
              >
                <Avatar name={person.name} photoUrl={portraitAvatar(person)} size="md" ringColor={engaged ? 'accent' : 'none'} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-hinge-black">
                    {person.name}, {person.age}
                  </p>
                  <p className="mt-0.5 text-caption text-hinge-black">“{answer.text}”</p>
                  {engaged && <p className="mt-1 text-[11px] font-bold text-hinge-accent">Tap to view profile →</p>}
                </div>
              </button>
              <button
                type="button"
                disabled={answer.likedByMe}
                onClick={() => likeSpaceAnswer(spaceId, answer.id)}
                aria-label={answer.likedByMe ? 'Liked' : `Like ${person.name}'s answer`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-hinge-white shadow-card disabled:opacity-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={answer.likedByMe ? 'var(--hinge-accent)' : 'none'}>
                  <path
                    d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
                    stroke="var(--hinge-accent)"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}
