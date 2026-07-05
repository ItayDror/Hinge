import clsx from 'clsx'
import type { TabScreen } from '../../state/navTypes'

interface BottomNavProps {
  active: TabScreen
  onNavigate: (screen: TabScreen) => void
  spacesHasActivity?: boolean
}

const TABS: { screen: TabScreen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    screen: 'discover',
    label: 'Discover',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill="none"
        />
      </svg>
    ),
  },
  {
    screen: 'likes',
    label: 'Likes You',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill="none"
        />
      </svg>
    ),
  },
  {
    screen: 'spaces',
    label: 'Spaces',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={active ? 2 : 1.6} fill="none" />
        <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth={active ? 2 : 1.6} />
      </svg>
    ),
  },
  {
    screen: 'chats',
    label: 'Chats',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v9A2.5 2.5 0 0 1 18.5 17H9l-5 4v-4H5.5A2.5 2.5 0 0 1 3 14.5v-9Z"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill="none"
        />
      </svg>
    ),
  },
  {
    screen: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={active ? 2 : 1.6} fill="none" />
        <path
          d="M4 20c1.2-4 4.2-6 8-6s6.8 2 8 6"
          stroke="currentColor"
          strokeWidth={active ? 2 : 1.6}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export function BottomNav({ active, onNavigate, spacesHasActivity }: BottomNavProps) {
  return (
    <nav className="shrink-0 border-t border-hinge-grey-light bg-hinge-white px-2 pb-2 pt-1.5">
      <ul className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const isActive = tab.screen === active
          return (
            <li key={tab.screen} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(tab.screen)}
                className={clsx(
                  'relative flex w-full min-h-11 flex-col items-center justify-center gap-0.5 rounded-btn py-1 transition-colors',
                  isActive ? 'text-hinge-black' : 'text-hinge-grey'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative">
                  {tab.icon(isActive)}
                  {tab.screen === 'spaces' && spacesHasActivity && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-pill bg-hinge-accent" />
                  )}
                </span>
                <span className="text-[11px] font-semibold leading-none">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
