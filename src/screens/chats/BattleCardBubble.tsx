import { AccentButton } from '../../components/AccentButton'
import type { ChatThreadData } from '../../data/mockData'

interface BattleCardBubbleProps {
  battleCard: ChatThreadData['battleCard']
  onAccept: () => void
  onIgnore: () => void
}

export function BattleCardBubble({ battleCard, onAccept, onIgnore }: BattleCardBubbleProps) {
  if (battleCard.status === 'invited') {
    return (
      <div className="max-w-[80%] rounded-card bg-hinge-grey-bg p-3">
        <p className="text-caption text-hinge-grey">Card invite pending</p>
        <div className="mt-2 flex gap-2">
          <AccentButton label="Accept" size="sm" onClick={onAccept} />
          <button type="button" onClick={onIgnore} className="min-h-9 rounded-btn px-3 text-[13px] font-bold text-hinge-grey">
            Ignore
          </button>
        </div>
      </div>
    )
  }

  if (battleCard.status === 'awaiting-other') {
    return (
      <div className="flex flex-col gap-2">
        <div className="ml-auto max-w-[80%] rounded-card bg-hinge-black p-3">
          <p className="text-caption text-white/60">{battleCard.question?.text}</p>
          <p className="mt-1 text-body text-hinge-white">{battleCard.myAnswer}</p>
        </div>
        <div className="max-w-[80%] rounded-card bg-hinge-grey-bg p-3">
          <p className="text-body italic text-hinge-grey" style={{ filter: 'blur(4px)' }}>
            Their answer will appear here once they respond
          </p>
          <p className="mt-1 text-caption font-semibold text-hinge-grey">Waiting for them to answer...</p>
        </div>
      </div>
    )
  }

  if (battleCard.status === 'revealed') {
    return (
      <div className="flex flex-col gap-2 [animation:reveal-fade_0.4s_ease-out]">
        <p className="text-center text-caption font-semibold text-hinge-grey">{battleCard.question?.text}</p>
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
