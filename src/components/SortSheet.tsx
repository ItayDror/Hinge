import { useState } from 'react'
import clsx from 'clsx'
import { BottomSheet } from './BottomSheet'
import { PrimaryButton } from './PrimaryButton'

export type LikesSort = 'all' | 'your-type' | 'from-spaces'

const OPTIONS: { id: LikesSort; label: string }[] = [
  { id: 'your-type', label: 'Your type' },
  { id: 'all', label: 'Recent' },
  { id: 'from-spaces', label: 'From Spaces' },
]

const LOCKED = ['Last active', 'Nearby']

interface SortSheetProps {
  open: boolean
  onClose: () => void
  current: LikesSort
  onApply: (sort: LikesSort) => void
  onLockedTap: () => void
}

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="15" r="1.4" fill="currentColor" />
  </svg>
)

/** Real-Hinge "Sort your Likes" sheet: radio rows, locked premium rows, black pill CTA. */
export function SortSheet({ open, onClose, current, onApply, onLockedTap }: SortSheetProps) {
  const [selected, setSelected] = useState<LikesSort>(current)

  return (
    <BottomSheet open={open} onClose={onClose}>
      <p className="mb-2 text-center text-[22px] font-bold text-hinge-black">Sort your Likes</p>
      <div className="flex flex-col">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className="flex min-h-[52px] items-center justify-between border-b border-hinge-grey-light text-left"
          >
            <span className="text-[16px] text-hinge-black">{opt.label}</span>
            <span
              className={clsx(
                'flex h-6 w-6 items-center justify-center rounded-pill border-2',
                selected === opt.id ? 'border-hinge-black bg-hinge-black' : 'border-hinge-grey-light'
              )}
            >
              {selected === opt.id && <span className="h-2 w-2 rounded-pill bg-hinge-white" />}
            </span>
          </button>
        ))}
        {LOCKED.map((label) => (
          <button
            key={label}
            type="button"
            onClick={onLockedTap}
            className="flex min-h-[52px] items-center justify-between border-b border-hinge-grey-light text-left last:border-b-0"
          >
            <span className="text-[16px] text-hinge-black">{label}</span>
            <span className="text-hinge-black">
              <LockIcon />
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5">
        <PrimaryButton
          label="Apply sorting"
          onClick={() => {
            onApply(selected)
            onClose()
          }}
        />
      </div>
    </BottomSheet>
  )
}
