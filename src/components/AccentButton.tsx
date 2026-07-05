import clsx from 'clsx'

interface AccentButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md'
}

// Reserve for the single highest-priority action per screen (PRD 2.5) —
// accent color is used sparingly per Hinge's own "color <=10% of surface" rule.
export function AccentButton({ label, onClick, disabled, fullWidth = false, size = 'md' }: AccentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-h-11 rounded-btn bg-hinge-accent text-hinge-white transition-opacity',
        size === 'sm' ? 'px-4 py-2 text-[14px] font-bold' : 'px-6 py-3 text-button-label',
        fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
        disabled ? 'opacity-30' : 'active:opacity-80'
      )}
    >
      {label}
    </button>
  )
}
