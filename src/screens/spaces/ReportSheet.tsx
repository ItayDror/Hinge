import { useState } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'
import clsx from 'clsx'

const REASONS = ['Harassment', 'Spam', 'Inappropriate content', 'Other']

interface ReportSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export function ReportSheet({ open, onClose, onSubmit }: ReportSheetProps) {
  const [reason, setReason] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!reason) return
    onSubmit(reason)
    setReason(null)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Report this post">
      <div className="flex flex-col gap-1">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className="flex min-h-11 items-center justify-between rounded-btn px-3 py-2.5 text-body text-hinge-black"
          >
            {r}
            <span
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-pill border-2',
                reason === r ? 'border-hinge-black' : 'border-hinge-grey-light'
              )}
            >
              {reason === r && <span className="h-2.5 w-2.5 rounded-pill bg-hinge-black" />}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <PrimaryButton label="Submit report" onClick={handleSubmit} disabled={!reason} />
      </div>
    </BottomSheet>
  )
}
