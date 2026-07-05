import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'

interface DateReadinessSheetProps {
  open: boolean
  onClose: () => void
  matchName: string
  onConfirm: () => void
}

export function DateReadinessSheet({ open, onClose, matchName, onConfirm }: DateReadinessSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <p className="text-[17px] font-bold text-hinge-black">
        Let {matchName} know you're ready to take this further?
      </p>
      <p className="mt-2 text-body text-hinge-grey">They won't be notified unless they're ready too.</p>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={onClose} className="min-h-11 px-2 text-body text-hinge-grey">
          Cancel
        </button>
        <div className="flex-1">
          <PrimaryButton
            label="Confirm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          />
        </div>
      </div>
    </BottomSheet>
  )
}
