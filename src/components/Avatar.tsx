import clsx from 'clsx'
import { initialsAvatarColor, initialsFromName } from '../data/placeholders'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
  verified?: boolean
  ringColor?: 'accent' | 'grey' | 'none'
}

const SIZE_MAP = {
  sm: 'h-8 w-8 text-[12px]',
  md: 'h-11 w-11 text-[15px]',
  lg: 'h-16 w-16 text-[22px]',
}

export function Avatar({ name, photoUrl, size = 'md', verified, ringColor = 'none' }: AvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={clsx(
          'flex items-center justify-center overflow-hidden rounded-pill font-bold text-hinge-white',
          SIZE_MAP[size],
          ringColor === 'accent' && 'ring-2 ring-hinge-accent ring-offset-2',
          ringColor === 'grey' && 'ring-2 ring-hinge-grey-light ring-offset-2'
        )}
        style={{ backgroundColor: photoUrl ? undefined : initialsAvatarColor(name) }}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          initialsFromName(name)
        )}
      </span>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-pill bg-hinge-accent text-hinge-white">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5 5 9l4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  )
}
