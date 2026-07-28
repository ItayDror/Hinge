import { useState } from 'react'
import { personById } from '../data/people'
import { useAppState } from '../state/AppStateContext'

// Presenter-facing control panel — deliberately styled unlike Hinge tokens so
// it's never mistaken for real product UI. Space likes already auto-reciprocate
// after a few seconds; this lets a live demo fire the beat immediately.
export function DebugSimulateBar() {
  const [open, setOpen] = useState(false)
  const { spaces, pendingLikes, matchWith, toggleSpaceWaitlist } = useAppState()

  const actions: { label: string; onClick: () => void }[] = []

  pendingLikes.forEach((like) => {
    const name = personById(like.personId).name
    actions.push({ label: `Simulate: ${name} liked you back`, onClick: () => matchWith(like.personId) })
  })

  spaces
    .filter((s) => s.status === 'waitlist')
    .forEach((s) => {
      actions.push({ label: `Simulate: cross waitlist threshold (${s.title})`, onClick: () => toggleSpaceWaitlist(s.id) })
    })

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
            <p className="text-[11px] text-neutral-500">No simulate actions right now.</p>
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
