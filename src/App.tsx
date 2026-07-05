import { MobileFrame } from './components/shell/MobileFrame'
import { BottomNav } from './components/shell/BottomNav'
import { ToastBanner } from './components/ToastBanner'
import { DebugSimulateBar } from './components/DebugSimulateBar'
import { ScreenRouter } from './ScreenRouter'
import { DailyQuestionInterstitial } from './screens/dailyquestion/DailyQuestionInterstitial'
import { AppStateProvider, useAppState } from './state/AppStateContext'
import { TAB_SCREENS, type TabScreen } from './state/navTypes'

function Shell() {
  const { currentScreen, goToTab, toast, dismissToast, spaces } = useAppState()
  const isTabScreen = (TAB_SCREENS as string[]).includes(currentScreen)
  const spacesHasActivity = spaces.some((s) => s.status === 'active')

  return (
    <MobileFrame>
      <ScreenRouter />
      {isTabScreen && (
        <BottomNav active={currentScreen as TabScreen} onNavigate={goToTab} spacesHasActivity={spacesHasActivity} />
      )}
      {toast && <ToastBanner message={toast.message} visible={toast.visible} onDismiss={dismissToast} />}
      <DailyQuestionInterstitial />
    </MobileFrame>
  )
}

function App() {
  return (
    <AppStateProvider>
      <Shell />
      <DebugSimulateBar />
    </AppStateProvider>
  )
}

export default App
