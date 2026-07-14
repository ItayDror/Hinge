import clsx from 'clsx'

interface PrimaryButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

/** Real-Hinge primary CTA: fully-rounded black pill ("Apply sorting", "Continue"). */
export function PrimaryButton({ label, onClick, disabled, fullWidth = true, type = 'button' }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-h-12 rounded-pill bg-hinge-black px-7 py-3.5 text-button-label text-hinge-white transition-opacity',
        fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
        disabled ? 'opacity-30' : 'active:opacity-80'
      )}
    >
      {label}
    </button>
  )
}
