import clsx from 'clsx'

interface PillProps {
  label: string
  active?: boolean
  onClick?: () => void
  tone?: 'soft' | 'outline'
}

export function Pill({ label, active, onClick, tone = 'soft' }: PillProps) {
  const isInteractive = !!onClick
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      className={clsx(
        'min-h-8 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-[13px] font-semibold transition-colors',
        tone === 'outline' && 'border border-hinge-grey-light bg-hinge-white text-hinge-black',
        tone === 'soft' && !active && 'bg-hinge-grey-bg text-hinge-black',
        tone === 'soft' && active && 'bg-hinge-black text-hinge-white'
      )}
    >
      {label}
    </button>
  )
}
