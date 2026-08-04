import { Avatar } from '../../components/Avatar'
import { Pill } from '../../components/Pill'
import type { SpaceData } from '../../data/mockData'

interface SpaceCardProps {
  space: SpaceData
  onOpen: () => void
  onJoinWaitlist: () => void
}

export function SpaceCard({ space, onOpen, onJoinWaitlist }: SpaceCardProps) {
  const isWaitlist = space.status === 'waitlist'

  return (
    <div className="rounded-card border border-hinge-grey-light bg-hinge-white p-4">
      <button type="button" onClick={onOpen} className="w-full text-left" disabled={isWaitlist}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* The Space's name is its question — set in serif, like a Hinge prompt. */}
            <p className="font-serif text-[18px] leading-snug text-hinge-black">
              {space.emoji} {space.question}
            </p>
            <p className="mt-1.5 text-caption text-hinge-grey">
              {isWaitlist
                ? `${space.waitlistCount} people interested · opens at ${space.waitlistThreshold}`
                : `${space.answers.length} answers · ${space.memberCount.toLocaleString()} in this space · ${space.activityLabel}`}
            </p>
            <p className="mt-0.5 text-caption font-semibold text-hinge-warn">
              ⏳ Closes in {space.closesInDays} days{space.endingLabel ? ` · ${space.endingLabel}` : ''}
            </p>
            {space.whyNow && <p className="mt-0.5 text-caption italic text-hinge-grey">{space.whyNow}</p>}
          </div>
          <div className="flex -space-x-2">
            {space.avatarPreviewUrls.map((url, i) => (
              <span key={i} className="rounded-pill ring-2 ring-hinge-white">
                <Avatar name={`m-${i}`} photoUrl={url} size="sm" />
              </span>
            ))}
          </div>
        </div>
      </button>
      <div className="mt-3">
        <Pill label={space.category} tone="outline" />
      </div>
      {isWaitlist && (
        <button
          type="button"
          onClick={onJoinWaitlist}
          className="mt-3 min-h-11 w-full rounded-pill border border-hinge-black py-2.5 text-button-label text-hinge-black"
        >
          Join waitlist
        </button>
      )}
    </div>
  )
}
