import clsx from 'clsx'

interface PrimaryButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

export function PrimaryButton({ label, onClick, disabled, fullWidth = true, type = 'button' }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-h-11 rounded-btn bg-hinge-black px-6 py-3 text-button-label text-hinge-white transition-opacity',
        fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
        disabled ? 'opacity-30' : 'active:opacity-80'
      )}
    >
      {label}
    </button>
  )
}
