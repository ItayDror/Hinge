import { useState } from 'react'

interface KnowYouMeterProps {
  streak: number
}

// Capped, badge-collection-style meter (not a percentage-to-100 deficit bar)
// per PRD Section 4.0b — visually caps out rather than reading as "incomplete."
export function KnowYouMeter({ streak }: KnowYouMeterProps) {
  const [showTip, setShowTip] = useState(false)
  const filled = Math.min(streak, 10)

  return (
    <div className="rounded-card bg-hinge-grey-bg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-bold text-hinge-black">How well we know you</p>
          <button
            type="button"
            onClick={() => setShowTip((v) => !v)}
            aria-label="What does this mean?"
            className="flex h-4 w-4 items-center justify-center rounded-pill border border-hinge-grey text-[10px] font-bold text-hinge-grey"
          >
            i
          </button>
        </div>
        <span className="flex items-center gap-1 text-[13px] font-bold text-hinge-black">🔥 {streak}</span>
      </div>
      {showTip && (
        <p className="mt-2 text-caption text-hinge-grey">
          This is private and only improves your matching — it's never shown to other people.
        </p>
      )}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-hinge-grey-light">
        <div className="h-full rounded-pill bg-hinge-accent transition-all duration-300" style={{ width: `${(filled / 10) * 100}%` }} />
      </div>
    </div>
  )
}
