import clsx from 'clsx'
import type { ReactNode } from 'react'

interface IconCircleProps {
  icon: ReactNode
  tint?: 'accent' | 'grey'
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
}

export function IconCircle({ icon, tint = 'grey', size = 'md' }: IconCircleProps) {
  return (
    <span
      className={clsx(
        'flex items-center justify-center rounded-pill',
        SIZE_MAP[size],
        tint === 'accent' ? 'bg-hinge-accent-soft text-hinge-accent' : 'bg-hinge-grey-bg text-hinge-grey'
      )}
    >
      {icon}
    </span>
  )
}
