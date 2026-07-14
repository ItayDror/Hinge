import { BottomSheet } from '../../components/BottomSheet'
import { AccentButton } from '../../components/AccentButton'
import { personById, portraitCard } from '../../data/people'
import { useAppState } from '../../state/AppStateContext'

interface ProfilePeekSheetProps {
  personId: string | null
  onClose: () => void
  /** The answer/context the person is being viewed through, if any. */
  contextAnswer?: string
}

// The contextual-discovery gate: profiles stay locked (blurred) until you've
// liked the person through their content — flipping discovery from
// photo-first to context-first.
export function ProfilePeekSheet({ personId, onClose, contextAnswer }: ProfilePeekSheetProps) {
  const { likedPeople, matchFromAnswer } = useAppState()

  if (!personId) return null
  const person = personById(personId)
  const unlocked = likedPeople.includes(personId)

  return (
    <BottomSheet open onClose={onClose}>
      {unlocked ? (
        <div className="flex flex-col items-center gap-3 pb-2 text-center">
          <div className="h-48 w-40 overflow-hidden rounded-card shadow-card">
            <img src={portraitCard(person)} alt={person.name} className="h-full w-full object-cover" />
          </div>
          <p className="text-[20px] font-bold text-hinge-black">
            {person.name}, {person.age}
          </p>
          {contextAnswer && (
            <p className="rounded-card bg-hinge-section px-4 py-2 font-serif text-[15px] italic text-hinge-black">
              “{contextAnswer}”
            </p>
          )}
          <div className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
            <p className="text-[14px] font-semibold text-hinge-black">{person.prompt.question}</p>
            <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">{person.prompt.answer}</p>
          </div>
          <p className="text-caption font-semibold text-hinge-accent">You liked their answer — profile unlocked ✓</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pb-2 text-center">
          <div className="relative h-48 w-40 overflow-hidden rounded-card shadow-card">
            <img
              src={portraitCard(person)}
              alt="Locked profile"
              className="h-full w-full object-cover"
              style={{ filter: 'blur(18px)' }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[36px]">🔒</span>
          </div>
          <p className="text-[18px] font-bold text-hinge-black">{person.name.charAt(0)}.</p>
          <p className="max-w-[260px] text-body text-hinge-grey">
            Profiles here open through the conversation, not the photo. Like {person.name.charAt(0)}.'s answer to unlock
            their profile.
          </p>
          {contextAnswer && (
            <div className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
              <p className="text-caption font-semibold text-hinge-grey">Their answer</p>
              <p className="mt-1.5 font-serif text-[18px] leading-snug text-hinge-black">“{contextAnswer}”</p>
            </div>
          )}
          <AccentButton
            label="Like their answer 💌"
            fullWidth
            onClick={() => matchFromAnswer(person.id, person.name)}
          />
        </div>
      )}
    </BottomSheet>
  )
}
