import clsx from 'clsx'

interface AccentButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md'
}

// Plum pill — reserve for the single highest-priority action per screen
// (Reveal my side, Send a message, Match back). Hinge uses its plum sparingly.
export function AccentButton({ label, onClick, disabled, fullWidth = false, size = 'md' }: AccentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-pill bg-hinge-accent text-hinge-white transition-opacity',
        size === 'sm' ? 'min-h-9 px-4 py-2 text-[14px] font-bold' : 'min-h-12 px-7 py-3.5 text-button-label',
        fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
        disabled ? 'opacity-30' : 'active:opacity-80'
      )}
    >
      {label}
    </button>
  )
}
