import { Avatar } from '../../components/Avatar'
import { AccentButton } from '../../components/AccentButton'
import type { SpaceData } from '../../data/mockData'

interface SpacePromoCardProps {
  space: SpaceData
  onPeek: () => void
}

export function SpacePromoCard({ space, onPeek }: SpacePromoCardProps) {
  return (
    <button
      type="button"
      onClick={onPeek}
      className="flex h-full w-full flex-col justify-between rounded-card bg-hinge-accent-soft p-6 text-left shadow-card"
    >
      <div>
        <span className="text-3xl">{space.emoji}</span>
        <p className="mt-4 text-[22px] font-bold leading-snug text-hinge-black">
          {space.memberCount.toLocaleString()} people near you are talking about {space.title}
        </p>
      </div>
      <div>
        <div className="mb-4 flex -space-x-2">
          {space.avatarPreviewUrls.map((url, i) => (
            <span key={i} className="rounded-pill ring-2 ring-hinge-accent-soft">
              <Avatar name={`member-${i}`} photoUrl={url} size="sm" />
            </span>
          ))}
        </div>
        <AccentButton label="Peek in" onClick={onPeek} />
      </div>
    </button>
  )
}
