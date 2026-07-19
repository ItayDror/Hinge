import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'
import { AccentButton } from '../../components/AccentButton'
import { SpaceProfileSheet } from './SpaceProfileSheet'
import { personById, portraitCard } from '../../data/people'
import type { SpaceData } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

interface ProfilePeekSheetProps {
  personId: string | null
  space: SpaceData
  onClose: () => void
  /** The answer the person is being viewed through, if any — enables the Gate B shortcut. */
  contextAnswerId?: string
  contextAnswerText?: string
}

/**
 * The Spaces access rules, made visible:
 *  Gate A — you haven't contributed to this space yet (no answer, no post):
 *           profiles are locked space-wide; friendly nudge to join in.
 *  Gate B — you've contributed, but haven't liked/commented on THIS person's
 *           content yet: their profile stays locked until you engage.
 *  Both pass — the full profile pops (SpaceProfileSheet).
 */
export function ProfilePeekSheet({ personId, space, onClose, contextAnswerId, contextAnswerText }: ProfilePeekSheetProps) {
  const { hasContributed, engagedPeople, likeSpaceAnswer, push } = useAppState()

  if (!personId) return null
  const person = personById(personId)
  const contributed = hasContributed(space.id)
  const engaged = engagedPeople.includes(personId)
  const initial = person.name.charAt(0).toUpperCase()

  if (contributed && engaged) {
    return <SpaceProfileSheet personId={personId} space={space} onClose={onClose} />
  }

  const BlurredPhoto = (
    <div className="relative h-48 w-40 overflow-hidden rounded-card shadow-card">
      <img src={portraitCard(person)} alt="Locked profile" className="h-full w-full object-cover" style={{ filter: 'blur(18px)' }} />
      <span className="absolute inset-0 flex items-center justify-center text-[36px]">🔒</span>
    </div>
  )

  if (!contributed) {
    // Gate A — contribution required to see anyone here.
    return (
      <BottomSheet open onClose={onClose}>
        <div className="flex flex-col items-center gap-3 pb-2 text-center">
          {BlurredPhoto}
          <p className="text-[20px] font-bold text-hinge-black">👋 Join in first</p>
          <p className="max-w-[280px] text-body text-hinge-grey">
            Spaces work conversation-first: answer today's question or post something in {space.title} — then you can
            start meeting the people here.
          </p>
          <PrimaryButton
            label="Answer today's question"
            onClick={() => {
              onClose()
              push({ screen: 'space-question', params: { spaceId: space.id } })
            }}
          />
        </div>
      </BottomSheet>
    )
  }

  // Gate B — engage with this specific person's content to unlock them.
  return (
    <BottomSheet open onClose={onClose}>
      <div className="flex flex-col items-center gap-3 pb-2 text-center">
        {BlurredPhoto}
        <p className="text-[20px] font-bold text-hinge-black">{initial}. is one like away</p>
        <p className="max-w-[280px] text-body text-hinge-grey">
          Like or comment on {initial}.'s posts to open their profile — that's how Spaces work: conversation first.
        </p>
        {contextAnswerText && (
          <div className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
            <p className="text-caption font-semibold text-hinge-grey">Their answer</p>
            <p className="mt-1.5 font-serif text-[18px] leading-snug text-hinge-black">“{contextAnswerText}”</p>
          </div>
        )}
        {contextAnswerId ? (
          <AccentButton label="Like their answer 💌" fullWidth onClick={() => likeSpaceAnswer(space.id, contextAnswerId)} />
        ) : (
          <PrimaryButton label="Got it" onClick={onClose} />
        )}
      </div>
    </BottomSheet>
  )
}
