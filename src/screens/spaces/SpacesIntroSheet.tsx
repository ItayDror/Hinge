interface SpacesIntroSheetProps {
  onClose: () => void
}

const STEPS = [
  { emoji: '💬', title: 'Join a conversation', body: 'Short-lived rooms around what’s happening near you right now.' },
  { emoji: '✍️', title: 'Answer the daily question', body: 'One question per Space — your answer is how people find you.' },
  { emoji: '💜', title: 'Like what someone said', body: 'Profiles open through the conversation, not the photo.' },
]

/**
 * First-visit welcome for Spaces — purple gradient with translucent cards.
 * Carries a light-touch safety reassurance rather than a warning banner.
 */
export function SpacesIntroSheet({ onClose }: SpacesIntroSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 overflow-hidden rounded-t-[28px] px-6 pb-8 pt-7 animate-[sheet-up_0.28s_ease-out]"
        style={{ background: 'linear-gradient(160deg, #6E3569 0%, #4A2247 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-28 h-64"
          style={{ background: 'radial-gradient(55% 100% at 50% 100%, rgba(255,255,255,0.25), transparent 70%)' }}
        />

        <div className="relative">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-pill bg-white/25" />

          <div className="text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-[26px] backdrop-blur">
              ✨
            </span>
            <p className="mt-4 font-serif text-[28px] leading-tight text-white">Welcome to Spaces</p>
            <p className="mt-1.5 text-[15px] leading-snug text-white/70">
              Meet people through what they say — not how they swipe.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {STEPS.map((step) => (
              <div key={step.title} className="flex items-start gap-3 rounded-card bg-white/10 p-3.5 backdrop-blur">
                <span className="text-[20px]">{step.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-white">{step.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-white/65">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-[12px] leading-snug text-white/55">
            🛡 Every Space is moderated, and your profile stays private until you join in.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 min-h-12 w-full rounded-pill bg-white px-7 py-3.5 text-button-label text-hinge-black active:opacity-80"
          >
            Explore Spaces
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
