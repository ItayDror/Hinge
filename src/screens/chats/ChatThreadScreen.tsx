import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Avatar } from '../../components/Avatar'
import { BattleCardPickerSheet } from './BattleCardPickerSheet'
import { BattleCardBubble } from './BattleCardBubble'
import { DateReadinessSheet } from './DateReadinessSheet'
import { HingeRecommendationCard } from './HingeRecommendationCard'
import { MutualReadinessCard } from './MutualReadinessCard'
import { useAppState } from '../../state/AppStateContext'

export function ChatThreadScreen() {
  const {
    chats,
    currentParams,
    pop,
    sendMessage,
    startBattleCard,
    answerBattleCard,
    simulateOtherAnswered,
    requestDateReadiness,
    selectAvailabilityTag,
    showToast,
  } = useAppState()

  const chat = chats.find((c) => c.id === currentParams?.chatId)

  const [draft, setDraft] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [contextChipDismissed, setContextChipDismissed] = useState(false)
  const [cardAnswerDraft, setCardAnswerDraft] = useState('')

  // Their answer reveals shortly after mine is submitted, so the mutual-reveal
  // payoff plays out hands-free in a live demo (debug bar can force it too).
  useEffect(() => {
    if (!chat || chat.battleCard.status !== 'awaiting-other') return
    const t = setTimeout(() => simulateOtherAnswered(chat.id), 2500)
    return () => clearTimeout(t)
  }, [chat, simulateOtherAnswered])

  if (!chat) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body text-hinge-grey">Chat not found.</p>
      </div>
    )
  }

  const answeringCard = chat.battleCard.status === 'accepted'
  const mutualReady = chat.dateReadiness.me && chat.dateReadiness.them
  const suggestionAlreadySent =
    !!chat.suggestedOpener && chat.messages.some((m) => m.sender === 'me' && m.text === chat.suggestedOpener)
  const showSuggestion = !!chat.suggestedOpener && !suggestionAlreadySent

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(chat.id, draft.trim())
    setDraft('')
  }

  const handleAnswerCard = () => {
    if (!cardAnswerDraft.trim()) return
    answerBattleCard(chat.id, cardAnswerDraft.trim())
    setCardAnswerDraft('')
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-1">
        <button type="button" onClick={pop} aria-label="Back" className="flex h-10 w-10 items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Avatar name={chat.matchName} photoUrl={chat.matchPhoto} size="sm" />
        <p className="flex-1 text-[16px] font-bold text-hinge-black">{chat.matchName}</p>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center text-hinge-black"
        >
          •••
        </button>
      </header>

      {menuOpen && (
        <div className="absolute right-3 top-12 z-30 w-56 rounded-card bg-hinge-white p-1 shadow-card">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              showToast('Reported. Thanks for letting us know.')
            }}
            className="block w-full rounded-btn px-3 py-2.5 text-left text-body text-hinge-warn"
          >
            Report conversation
          </button>
        </div>
      )}

      {chat.spaceOriginLabel && !contextChipDismissed && (
        <div className="mx-5 mb-2 flex shrink-0 items-center justify-between gap-2 rounded-pill bg-hinge-accent-soft px-3 py-1.5">
          <span className="truncate text-[12px] font-semibold text-hinge-black">{chat.spaceOriginLabel}</span>
          <button type="button" onClick={() => setContextChipDismissed(true)} aria-label="Dismiss" className="text-hinge-grey">
            ✕
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        <div className="flex flex-col gap-2">
          {chat.messages.map((m) => {
            if (m.kind === 'system' || m.kind === 'battle-card-invite') {
              return (
                <p key={m.id} className="my-1 text-center text-caption font-semibold text-hinge-grey">
                  {m.text}
                </p>
              )
            }
            return (
              <div
                key={m.id}
                className={clsx(
                  'max-w-[80%] rounded-card px-3.5 py-2.5 text-body',
                  m.sender === 'me' ? 'ml-auto bg-hinge-black text-hinge-white' : 'bg-hinge-grey-bg text-hinge-black'
                )}
              >
                {m.text}
              </div>
            )
          })}

          {chat.battleCard.status !== 'none' && (
            <BattleCardBubble battleCard={chat.battleCard} matchName={chat.matchName} />
          )}

          {mutualReady && (
            <div className="mt-1">
              <MutualReadinessCard
                matchName={chat.matchName}
                availabilityTagSelected={chat.dateReadiness.availabilityTagSelected}
                onSelectTag={(tag) => selectAvailabilityTag(chat.id, tag)}
              />
            </div>
          )}

          {showSuggestion && (
            <HingeRecommendationCard
              suggestion={chat.suggestedOpener!}
              onSend={() => sendMessage(chat.id, chat.suggestedOpener!)}
            />
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-hinge-grey-light px-4 pb-3 pt-2">
        {/* Always-visible date-readiness affordance (PRD 4.4d: subtle pill
            above the compose bar). Mutual state renders as the celebration
            card in the thread instead. */}
        {!mutualReady && (
          <div className="mb-2 flex justify-center">
            {chat.dateReadiness.me ? (
              <span className="rounded-pill bg-hinge-grey-bg px-3.5 py-1.5 text-[12px] font-semibold text-hinge-grey">
                ✓ You marked this as date-ready
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setDateSheetOpen(true)}
                className="min-h-8 rounded-pill border border-hinge-accent px-3.5 py-1.5 text-[12px] font-bold text-hinge-accent active:opacity-80"
              >
                💫 I'm ready for a date
              </button>
            )}
          </div>
        )}

        {answeringCard ? (
          <div>
            <p className="mb-2 text-prompt-q text-hinge-black">{chat.battleCard.question?.text}</p>
            <div className="flex items-center gap-2">
              <input
                value={cardAnswerDraft}
                onChange={(e) => setCardAnswerDraft(e.target.value)}
                placeholder="Answer privately..."
                className="min-h-11 flex-1 rounded-pill bg-hinge-grey-bg px-4 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAnswerCard}
                disabled={!cardAnswerDraft.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-hinge-accent text-hinge-white disabled:opacity-30"
                aria-label="Send answer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="m5 12 14-7-7 14-2-5-5-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label="Play a card"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-[20px]"
            >
              🎴
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="min-h-11 flex-1 rounded-pill bg-hinge-grey-bg px-4 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-hinge-black text-hinge-white disabled:opacity-30"
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="m5 12 14-7-7 14-2-5-5-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <BattleCardPickerSheet open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(tier) => startBattleCard(chat.id, tier)} />
      <DateReadinessSheet
        open={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        matchName={chat.matchName}
        onConfirm={() => requestDateReadiness(chat.id)}
      />
    </div>
  )
}
