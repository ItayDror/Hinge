import type { ChatThreadData } from '../../data/mockData'

interface BattleCardBubbleProps {
  battleCard: ChatThreadData['battleCard']
  matchName: string
}

// The face-down "mystery card" back — deliberately game-like (a Chance-card
// "?" motif) while keeping motion calm per Hinge's no-slot-machine rule.
function CardBack() {
  return (
    <div
      className="w-52 rounded-2xl bg-hinge-black p-4 shadow-card"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 10px, transparent 10px 20px)',
      }}
    >
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Battle Card</p>
      <div className="my-4 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-hinge-accent text-[34px] font-black text-hinge-white shadow-card">
          ?
        </span>
      </div>
      <p className="text-center text-[12px] leading-snug text-white/60">
        One question. Both answers reveal at the same time.
      </p>
    </div>
  )
}

export function BattleCardBubble({ battleCard, matchName }: BattleCardBubbleProps) {
  if (battleCard.status === 'invited') {
    return (
      <div className="flex flex-col items-end gap-2 self-end">
        <CardBack />
        <p className="flex items-center gap-1.5 text-caption font-semibold text-hinge-grey">
          <span className="h-2 w-2 animate-pulse rounded-pill bg-hinge-accent" />
          Waiting for {matchName} to accept…
        </p>
      </div>
    )
  }

  if (battleCard.status === 'accepted') {
    return (
      <div className="w-72 self-center rounded-card border border-hinge-accent/30 bg-hinge-white p-4 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-hinge-accent">🎴 Battle Card</p>
        <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">{battleCard.question?.text}</p>
        <p className="mt-2 text-caption text-hinge-grey">
          Answer below — {matchName}'s answer stays hidden until you do.
        </p>
      </div>
    )
  }

  if (battleCard.status === 'awaiting-other') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-center text-caption font-semibold text-hinge-grey">{battleCard.question?.text}</p>
        <div className="ml-auto max-w-[80%] rounded-card bg-hinge-black p-3">
          <p className="text-body text-hinge-white">{battleCard.myAnswer}</p>
        </div>
        <div className="max-w-[80%] rounded-card bg-hinge-grey-bg p-3">
          <p className="text-body italic text-hinge-grey" style={{ filter: 'blur(4px)' }}>
            Their answer will appear here once they respond
          </p>
          <p className="mt-1 text-caption font-semibold text-hinge-grey">Waiting for {matchName} to answer...</p>
        </div>
      </div>
    )
  }

  if (battleCard.status === 'revealed') {
    return (
      <div className="flex flex-col gap-2 [animation:reveal-fade_0.4s_ease-out]">
        <div className="self-center rounded-pill bg-hinge-accent-soft px-3 py-1">
          <p className="text-caption font-semibold text-hinge-accent">🎴 {battleCard.question?.text}</p>
        </div>
        <div className="ml-auto max-w-[80%] rounded-card bg-hinge-black p-3">
          <p className="text-body text-hinge-white">{battleCard.myAnswer}</p>
        </div>
        <div className="max-w-[80%] rounded-card bg-hinge-grey-bg p-3">
          <p className="text-body text-hinge-black">{battleCard.theirAnswer}</p>
        </div>
        <style>{`
          @keyframes reveal-fade {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  if (battleCard.status === 'expired') {
    return (
      <div className="max-w-[80%] rounded-card bg-hinge-grey-bg p-3 opacity-50">
        <p className="text-caption text-hinge-grey">Card invite expired</p>
      </div>
    )
  }

  return null
}
