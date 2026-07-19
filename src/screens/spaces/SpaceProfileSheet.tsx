import { PhotoCard } from '../../components/ProfileCard'
import { PromptCard } from '../../components/PromptCard'
import { VitalsCard } from '../../components/VitalsCard'
import { CircleButton, XIcon } from '../../components/CircleButton'
import { personById, portraitCard } from '../../data/people'
import type { SpaceData } from '../../data/mockData'
import { useAppState } from '../../state/AppStateContext'

interface SpaceProfileSheetProps {
  personId: string
  space: SpaceData
  onClose: () => void
}

function secondPhoto(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?w=600&h=750&fit=crop&crop=entropy&auto=format`
}

/**
 * The profile pop: once you've contributed to the space AND engaged with this
 * person's content, their full profile opens exactly like the Discover feed —
 * but for this single person only. X closes back to the space; it never
 * advances to another profile.
 */
export function SpaceProfileSheet({ personId, space, onClose }: SpaceProfileSheetProps) {
  const { likeProfile, likedProfiles } = useAppState()
  const person = personById(personId)
  const alreadyLiked = likedProfiles.includes(personId)

  const heart = () => {
    likeProfile(person.id, person.name)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-hinge-bg animate-[sheet-up_0.22s_ease-out]">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-profile-name text-hinge-black">{person.name}</h1>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--hinge-accent)">
              <path d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z" />
            </svg>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to space"
            className="flex h-10 w-10 items-center justify-center text-hinge-black"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-hinge-accent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--hinge-accent)">
            <path d="m12 1.7 2.4 2 3.1-.4 1.2 2.9 2.9 1.2-.4 3.1 2 2.4-2 2.4.4 3.1-2.9 1.2-1.2 2.9-3.1-.4-2.4 2-2.4-2-3.1.4-1.2-2.9-2.9-1.2.4-3.1-2-2.4 2-2.4-.4-3.1 2.9-1.2 1.2-2.9 3.1.4 2.4-2Z" />
            <path d="m8.8 12.1 2.2 2.2 4.2-4.6" stroke="white" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verified
        </p>
        <span className="mt-2 inline-block rounded-pill bg-hinge-accent-soft px-3 py-1 text-[12px] font-bold text-hinge-accent">
          {space.emoji} From {space.title}
        </span>

        <div className="mt-3 flex flex-col gap-3">
          <PhotoCard photoUrl={portraitCard(person)} alt={person.name} onHeart={alreadyLiked ? undefined : heart} />
          <PromptCard
            question={person.prompt.question}
            answer={person.prompt.answer}
            onHeart={alreadyLiked ? undefined : heart}
          />
          <VitalsCard person={person} />
          <PhotoCard photoUrl={secondPhoto(person.photoId)} alt={person.name} onHeart={alreadyLiked ? undefined : heart} />
          {alreadyLiked && (
            <p className="text-center text-caption font-semibold text-hinge-accent">You already sent {person.name} a like 💌</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-5 z-20">
        <CircleButton ariaLabel="Close profile" size="lg" onClick={onClose}>
          <XIcon size={26} />
        </CircleButton>
      </div>

      <style>{`
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
