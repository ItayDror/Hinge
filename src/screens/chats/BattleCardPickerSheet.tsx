import { BottomSheet } from '../../components/BottomSheet'

interface BattleCardPickerSheetProps {
  open: boolean
  onClose: () => void
  onSelect: (tier: 'light' | 'deep') => void
}

const TIERS: { tier: 'light' | 'deep'; label: string; description: string }[] = [
  { tier: 'light', label: 'Light', description: 'This or that, fast' },
  { tier: 'deep', label: 'Deep', description: 'A real question' },
]

export function BattleCardPickerSheet({ open, onClose, onSelect }: BattleCardPickerSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Play a card 🎴">
      <div className="flex flex-col gap-2">
        {TIERS.map((t) => (
          <button
            key={t.tier}
            type="button"
            onClick={() => {
              onSelect(t.tier)
              onClose()
            }}
            className="rounded-card bg-hinge-grey-bg p-4 text-left"
          >
            <p className="text-[15px] font-bold text-hinge-black">{t.label}</p>
            <p className="text-caption text-hinge-grey">{t.description}</p>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
