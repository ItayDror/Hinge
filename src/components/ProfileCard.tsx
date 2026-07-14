import { CircleButton, HeartIcon } from './CircleButton'

interface PhotoCardProps {
  photoUrl: string
  alt: string
  onHeart?: () => void
  /** e.g. "🏀 Also in Knicks in 5" — shared-space context chip over the photo. */
  overlayChip?: string
}

/** Real-Hinge photo card: rounded photo with a floating white heart circle. */
export function PhotoCard({ photoUrl, alt, onHeart, overlayChip }: PhotoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card shadow-card">
      <img src={photoUrl} alt={alt} className="aspect-[4/5] w-full object-cover" />
      {overlayChip && (
        <span className="absolute left-4 top-4 rounded-pill bg-hinge-accent-soft px-3 py-1.5 text-[12px] font-bold text-hinge-accent shadow-card">
          {overlayChip}
        </span>
      )}
      {onHeart && (
        <div className="absolute bottom-4 right-4">
          <CircleButton ariaLabel={`Like ${alt}'s photo`} size="md" onClick={onHeart}>
            <HeartIcon />
          </CircleButton>
        </div>
      )}
    </div>
  )
}
