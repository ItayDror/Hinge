import clsx from 'clsx'
import type { TabScreen } from '../../state/navTypes'
import { placeholderPhoto } from '../../data/placeholders'

interface BottomNavProps {
  active: TabScreen
  onNavigate: (screen: TabScreen) => void
  spacesHasActivity?: boolean
  likesCount?: number
  chatsCount?: number
}

// Real-Hinge bottom nav: solid black bar, icon-only (no labels), plum count
// badges, avatar photo for the profile slot. Our one structural addition —
// the Spaces tab — sits center with a spark glyph + plum activity dot.
const HMark = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M6 3v18M18 3v18M6 12c4-4.2 8-4.2 12 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

const SparkIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.5c.9 4.6 2.9 6.6 7.5 7.5-4.6.9-6.6 2.9-7.5 7.5-.9-4.6-2.9-6.6-7.5-7.5 4.6-.9 6.6-2.9 7.5-7.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M18.5 15.5c.4 2.1 1.3 3 3.4 3.4-2.1.4-3 1.3-3.4 3.4-.4-2.1-1.3-3-3.4-3.4 2.1-.4 3-1.3 3.4-3.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const NavHeart = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
      stroke="currentColor"
      strokeWidth="1.9"
    />
  </svg>
)

const NavChat = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.2V6.5Z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M19.5 9.5c.3 0 .5.2.5.5v10l-3.4-2.6H10" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
  </svg>
)

function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-1.5 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-pill bg-hinge-accent px-1 text-[10px] font-bold text-hinge-white" style={{ height: 18 }}>
      {count}
    </span>
  )
}

export function BottomNav({ active, onNavigate, spacesHasActivity, likesCount = 0, chatsCount = 0 }: BottomNavProps) {
  const slot = (screen: TabScreen, icon: React.ReactNode, label: string, badge?: React.ReactNode) => {
    const isActive = active === screen
    return (
      <button
        type="button"
        onClick={() => onNavigate(screen)}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'relative flex h-12 flex-1 items-center justify-center transition-colors',
          isActive ? 'text-white' : 'text-[#8A8A8A]'
        )}
      >
        <span className="relative">
          {icon}
          {badge}
        </span>
      </button>
    )
  }

  return (
    <nav className="shrink-0 bg-hinge-black px-3 pb-3 pt-2">
      <div className="flex items-center justify-between">
        {slot('discover', <HMark />, 'Discover')}
        {slot('likes', <NavHeart />, 'Likes You', <Badge count={likesCount} />)}
        {slot(
          'spaces',
          <SparkIcon />,
          'Spaces',
          spacesHasActivity ? <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-pill bg-hinge-accent" /> : undefined
        )}
        {slot('chats', <NavChat />, 'Matches', <Badge count={chatsCount} />)}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="Profile"
          aria-current={active === 'profile' ? 'page' : undefined}
          className="relative flex h-12 flex-1 items-center justify-center"
        >
          <span
            className={clsx(
              'h-7 w-7 overflow-hidden rounded-pill',
              active === 'profile' ? 'ring-2 ring-white' : 'ring-1 ring-[#555]'
            )}
          >
            <img src={placeholderPhoto('me-avatar', 60, 60)} alt="Profile" className="h-full w-full object-cover" />
          </span>
        </button>
      </div>
    </nav>
  )
}
