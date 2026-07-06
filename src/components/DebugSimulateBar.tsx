import { useState } from 'react'
import { useAppState } from '../state/AppStateContext'

// Presenter-facing control panel — deliberately styled unlike Hinge tokens so
// it's never mistaken for real product UI. Lets a live demo jump past
// "waiting for the other person" states without needing a second device.
// The same underlying actions also auto-advance on a timer where noted, so
// this is a fallback/speed-up control, not the only path through a flow.
export function DebugSimulateBar() {
  const [open, setOpen] = useState(false)
  const {
    currentScreen,
    currentParams,
    spaces,
    chats,
    blindModeBySpacePost,
    advanceBlindMode,
    toggleSpaceWaitlist,
    acceptBattleCard,
    simulateOtherAnswered,
    simulateOtherReady,
  } = useAppState()

  const actions: { label: string; onClick: () => void }[] = []

  if (currentScreen === 'space-detail') {
    const space = spaces.find((s) => s.id === currentParams?.spaceId)
    if (space) {
      Object.entries(blindModeBySpacePost)
        .filter(([key, state]) => key.startsWith(`${space.id}:`) && state === 'waiting')
        .forEach(([key]) => {
          actions.push({ label: 'Simulate: they revealed too', onClick: () => advanceBlindMode(key) })
        })
    }
  }

  spaces
    .filter((s) => s.status === 'waitlist')
    .forEach((s) => {
      actions.push({ label: `Simulate: cross waitlist threshold (${s.title})`, onClick: () => toggleSpaceWaitlist(s.id) })
    })

  if (currentScreen === 'chat-thread') {
    const chat = chats.find((c) => c.id === currentParams?.chatId)
    if (chat) {
      if (chat.battleCard.status === 'invited') {
        actions.push({ label: `Simulate: ${chat.matchName} accepted the card`, onClick: () => acceptBattleCard(chat.id) })
      }
      if (chat.battleCard.status === 'awaiting-other') {
        actions.push({ label: 'Simulate: they answered the card', onClick: () => simulateOtherAnswered(chat.id) })
      }
      if (chat.dateReadiness.me && !chat.dateReadiness.them) {
        actions.push({ label: "Simulate: they're ready too", onClick: () => simulateOtherReady(chat.id) })
      }
    }
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 font-mono">
      {open ? (
        <div className="w-64 rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-neutral-200 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-neutral-400">Presenter: Simulate</span>
            <button type="button" onClick={() => setOpen(false)} className="text-neutral-400">
              ✕
            </button>
          </div>
          {actions.length === 0 ? (
            <p className="text-[11px] text-neutral-500">No simulate actions for this screen.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-left text-[11px] text-neutral-100 hover:bg-neutral-700"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-neutral-600 bg-neutral-900 px-3 py-2 text-[11px] text-neutral-300 shadow-xl"
        >
          ⚙ Simulate
        </button>
      )}
    </div>
  )
}
