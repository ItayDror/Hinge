import { useAppState } from './state/AppStateContext'
import { DiscoverScreen } from './screens/discover/DiscoverScreen'
import { LikesYouScreen } from './screens/likes/LikesYouScreen'
import { SpacesHomeScreen } from './screens/spaces/SpacesHomeScreen'
import { SpaceDetailScreen } from './screens/spaces/SpaceDetailScreen'
import { SpaceQuestionScreen } from './screens/spaces/SpaceQuestionScreen'
import { ChatListScreen } from './screens/chats/ChatListScreen'
import { ChatThreadScreen } from './screens/chats/ChatThreadScreen'
import { ProfileScreen } from './screens/profile/ProfileScreen'
import { StandoutsScreen } from './screens/standouts/StandoutsScreen'

export function ScreenRouter() {
  const { currentScreen } = useAppState()

  switch (currentScreen) {
    case 'discover':
      return <DiscoverScreen />
    case 'standouts':
      return <StandoutsScreen />
    case 'likes':
      return <LikesYouScreen />
    case 'spaces':
      return <SpacesHomeScreen />
    case 'space-detail':
      return <SpaceDetailScreen />
    case 'space-question':
      return <SpaceQuestionScreen />
    case 'chats':
      return <ChatListScreen />
    case 'chat-thread':
      return <ChatThreadScreen />
    case 'profile':
      return <ProfileScreen />
    default:
      return null
  }
}
