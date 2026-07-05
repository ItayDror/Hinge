export type TabScreen = 'discover' | 'likes' | 'spaces' | 'chats' | 'profile'

export type Screen = TabScreen | 'space-detail' | 'chat-thread'

export interface NavStackEntry {
  screen: Screen
  params?: Record<string, string>
}

export const TAB_SCREENS: TabScreen[] = ['discover', 'likes', 'spaces', 'chats', 'profile']
