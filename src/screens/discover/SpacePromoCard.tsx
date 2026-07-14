import { Avatar } from '../../components/Avatar'
import type { SpaceData } from '../../data/mockData'

interface SpacePromoCardProps {
  space: SpaceData
  onPeek: () => void
  onSkip?: () => void
}

/** In-feed Space promo — restyled to the real design language: white card,
 *  plum small-caps label, serif headline, black pill CTA. */
export function SpacePromoCard({ space, onPeek, onSkip }: SpacePromoCardProps) {
  return (
    <div className="overflow-hidden rounded-card bg-hinge-white shadow-card">
      <div className="bg-hinge-accent-soft px-5 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hinge-accent">Happening near you</p>
      </div>
      <div className="p-5">
        <p className="font-serif text-serif-answer text-hinge-black">
          {space.memberCount.toLocaleString()} people are talking about {space.title} {space.emoji}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {space.avatarPreviewUrls.map((url, i) => (
              <span key={i} className="rounded-pill ring-2 ring-hinge-white">
                <Avatar name={`member-${i}`} photoUrl={url} size="sm" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {onSkip && (
              <button type="button" onClick={onSkip} className="text-[14px] font-semibold text-hinge-grey">
                Not now
              </button>
            )}
            <button
              type="button"
              onClick={onPeek}
              className="rounded-pill bg-hinge-black px-5 py-2.5 text-[14px] font-bold text-hinge-white active:opacity-80"
            >
              Peek in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
