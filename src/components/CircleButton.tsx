import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CircleButtonProps {
  onClick?: () => void
  ariaLabel: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: ReactNode
  className?: string
}

const SIZE = { sm: 'h-11 w-11', md: 'h-14 w-14', lg: 'h-16 w-16' }

/** Floating white action circle (X / heart) — the real Hinge like/pass affordance. */
export function CircleButton({ onClick, ariaLabel, size = 'md', disabled, children, className }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center justify-center rounded-pill bg-hinge-white text-hinge-black shadow-float transition-transform active:scale-95',
        SIZE[size],
        disabled && 'opacity-60',
        className
      )}
    >
      {children}
    </button>
  )
}

export function XIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function HeartIcon({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'var(--hinge-accent)' : 'none'}>
      <path
        d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
        stroke={filled ? 'var(--hinge-accent)' : 'currentColor'}
        strokeWidth="1.8"
      />
    </svg>
  )
}
