import { useState } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'

const CHAR_LIMIT = 280

interface AnswerComposerSheetProps {
  open: boolean
  onClose: () => void
  question: string
  onSubmit: (text: string) => void
}

/** One answer per person per Space — this is the only way to contribute. */
export function AnswerComposerSheet({ open, onClose, question, onSubmit }: AnswerComposerSheetProps) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Your answer">
      <p className="mb-3 font-serif text-[19px] leading-snug text-hinge-black">{question}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
        placeholder="Say something only you would say..."
        rows={4}
        className="w-full resize-none rounded-card bg-hinge-grey-bg p-3 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
      />
      <div className="mt-1 flex justify-end">
        <span className="text-caption text-hinge-grey">
          {text.length}/{CHAR_LIMIT}
        </span>
      </div>
      <p className="mt-2 text-caption text-hinge-grey">🛡 Visible to this Space only</p>
      <div className="mt-4">
        <PrimaryButton label="Post answer" onClick={handleSubmit} disabled={!text.trim()} />
      </div>
    </BottomSheet>
  )
}
