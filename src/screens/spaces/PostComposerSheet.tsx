import { useState } from 'react'
import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'

const CHAR_LIMIT = 280
const DAILY_POST_LIMIT = 3

interface PostComposerSheetProps {
  open: boolean
  onClose: () => void
  spaceTitle: string
  postsToday: number
  onSubmit: (text: string) => void
}

export function PostComposerSheet({ open, onClose, spaceTitle, postsToday, onSubmit }: PostComposerSheetProps) {
  const [text, setText] = useState('')
  const rateLimited = postsToday >= DAILY_POST_LIMIT

  const handleSubmit = () => {
    if (!text.trim() || rateLimited) return
    onSubmit(text.trim())
    setText('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="New post">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
        disabled={rateLimited}
        placeholder={`Share something about ${spaceTitle}...`}
        rows={4}
        className="w-full resize-none rounded-card bg-hinge-grey-bg p-3 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none disabled:opacity-50"
      />
      <div className="mt-1 flex justify-end">
        <span className="text-caption text-hinge-grey">
          {text.length}/{CHAR_LIMIT}
        </span>
      </div>
      <p className="mt-2 text-caption text-hinge-grey">Posting as you — your profile stays locked until someone likes your content</p>
      {rateLimited && (
        <p className="mt-2 rounded-card bg-hinge-grey-bg p-3 text-caption text-hinge-grey">
          You've hit today's post limit for this space — try again tomorrow
        </p>
      )}
      <div className="mt-4">
        <PrimaryButton label="Post" onClick={handleSubmit} disabled={!text.trim() || rateLimited} />
      </div>
    </BottomSheet>
  )
}
