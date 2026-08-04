import { personById, portraitCard } from '../../data/people'
import { placeholderPhoto } from '../../data/placeholders'
import { useAppState } from '../../state/AppStateContext'

/**
 * The payoff of the whole flow: you liked someone through their content in a
 * Space, and they liked you back. Sits above everything and hands you
 * straight into the conversation.
 */
export function MatchCelebrationSheet() {
  const { newMatch, dismissNewMatch, spaces, push } = useAppState()

  if (!newMatch) return null

  const person = personById(newMatch.personId)
  const space = newMatch.spaceId ? spaces.find((s) => s.id === newMatch.spaceId) : undefined

  const openChat = () => {
    dismissNewMatch()
    push({ screen: 'chat-thread', params: { chatId: newMatch.chatId } })
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={dismissNewMatch} />
      <div
        className="relative z-10 overflow-hidden rounded-t-[28px] px-6 pb-8 pt-7 text-center animate-[sheet-up_0.28s_ease-out]"
        style={{ background: 'linear-gradient(160deg, #6E3569 0%, #4A2247 100%)' }}
      >
        {/* soft highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-56"
          style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(255,255,255,0.22), transparent 70%)' }}
        />

        <div className="relative">
          <div className="flex items-center justify-center -space-x-5">
            <img
              src={placeholderPhoto('me-avatar', 200, 200)}
              alt="You"
              className="h-24 w-24 rounded-pill border-[3px] border-white/80 object-cover"
            />
            <img
              src={portraitCard(person)}
              alt={person.name}
              className="h-24 w-24 rounded-pill border-[3px] border-white/80 object-cover"
            />
          </div>

          <p className="mt-5 font-serif text-[28px] leading-tight text-white">It's a match</p>
          <p className="mt-1.5 text-[15px] text-white/70">
            {person.name} liked you back{space ? '' : ' — say hello'}
          </p>

          {space && (
            <span className="mt-4 inline-block rounded-pill bg-white/15 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur">
              {space.emoji} You met in “{space.question}”
            </span>
          )}

          <button
            type="button"
            onClick={openChat}
            className="mt-6 min-h-12 w-full rounded-pill bg-white px-7 py-3.5 text-button-label text-hinge-black active:opacity-80"
          >
            Send a message
          </button>
          <button type="button" onClick={dismissNewMatch} className="mt-2 min-h-11 w-full text-[15px] text-white/60">
            Keep browsing
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
