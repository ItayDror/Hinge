import { useState } from 'react'
import clsx from 'clsx'
import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'
import { useAppState } from '../../state/AppStateContext'

export function DailyQuestionInterstitial() {
  const { dailyQuestion, showDailyInterstitial, dismissDailyInterstitial, skipDailyQuestion, answerDailyQuestion } =
    useAppState()
  const [answer, setAnswer] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')

  const open = showDailyInterstitial && !dailyQuestion.answeredToday

  const handleSubmit = () => {
    if (!answer.trim()) return
    answerDailyQuestion(answer.trim(), visibility)
    setAnswer('')
  }

  return (
    <BottomSheet open={open} onClose={() => { skipDailyQuestion(); dismissDailyInterstitial() }}>
      <p className="text-caption font-semibold text-hinge-grey">Today's question</p>
      <p className="mt-1 text-prompt-q text-hinge-black">{dailyQuestion.question.text}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
        rows={1}
        className="mt-3 max-h-24 w-full resize-none rounded-card bg-hinge-grey-bg p-3 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
        style={{ minHeight: '2.75rem' }}
      />

      <div className="mt-3 flex rounded-pill bg-hinge-grey-bg p-1">
        {(['private', 'public'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVisibility(v)}
            className={clsx(
              'flex-1 min-h-9 rounded-pill text-[13px] font-bold capitalize transition-colors',
              visibility === v ? 'bg-hinge-black text-hinge-white' : 'text-hinge-grey'
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="mt-2 text-caption text-hinge-grey">
        {visibility === 'private'
          ? 'Only Hinge sees this — it helps us match and suggest better openers.'
          : 'Shown on your profile for 24 hours, like a Story.'}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => { skipDailyQuestion(); dismissDailyInterstitial() }}
          className="min-h-11 px-2 text-body text-hinge-grey"
        >
          Skip
        </button>
        <div className="flex-1">
          <PrimaryButton label="Answer" onClick={handleSubmit} disabled={!answer.trim()} />
        </div>
      </div>
    </BottomSheet>
  )
}
