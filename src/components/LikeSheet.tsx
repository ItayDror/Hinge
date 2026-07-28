import { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { AccentButton } from './AccentButton'
import { personById, portraitCard } from '../data/people'

interface LikeSheetProps {
  personId: string | null
  onClose: () => void
  /** Called with an optional message — sending without one is always allowed. */
  onSend: (message?: string) => void
  /** What you're liking them through, e.g. their answer in a Space. */
  context?: { label: string; text: string }
}

/**
 * Real-Hinge behaviour: a like can carry an optional comment. Nothing here is
 * required — "Send like" works with an empty field.
 */
export function LikeSheet({ personId, onClose, onSend, context }: LikeSheetProps) {
  const [message, setMessage] = useState('')

  if (!personId) return null
  const person = personById(personId)

  const send = () => {
    onSend(message.trim() || undefined)
    setMessage('')
    onClose()
  }

  return (
    <BottomSheet open onClose={onClose}>
      <div className="flex items-start gap-3 pb-1">
        <img
          src={portraitCard(person)}
          alt={person.name}
          className="h-20 w-16 shrink-0 rounded-card object-cover shadow-card"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-bold text-hinge-black">Like {person.name}</p>
          {context ? (
            <>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-hinge-accent">{context.label}</p>
              <p className="mt-0.5 font-serif text-[15px] leading-snug text-hinge-black">“{context.text}”</p>
            </>
          ) : (
            <p className="mt-1 text-caption text-hinge-grey">
              {person.prompt.question} — “{person.prompt.answer}”
            </p>
          )}
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a comment (optional)…"
        rows={3}
        className="mt-4 w-full resize-none rounded-card bg-hinge-section p-3 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
      />

      <p className="mt-2 text-[11px] text-hinge-grey">Be kind — Hinge reviews reports in every Space.</p>

      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={send} className="min-h-11 px-2 text-body text-hinge-grey">
          Skip
        </button>
        <div className="flex-1">
          <AccentButton label={message.trim() ? 'Send like & comment' : 'Send like'} fullWidth onClick={send} />
        </div>
      </div>
    </BottomSheet>
  )
}
