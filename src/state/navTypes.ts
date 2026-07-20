// Bottom nav order, left to right: feed, standouts, spaces, liked you, messages.
export type TabScreen = 'discover' | 'standouts' | 'spaces' | 'likes' | 'chats'

export type Screen = TabScreen | 'space-detail' | 'space-question' | 'chat-thread' | 'profile'

export interface NavStackEntry {
  screen: Screen
  params?: Record<string, string>
}

export const TAB_SCREENS: TabScreen[] = ['discover', 'standouts', 'spaces', 'likes', 'chats']
