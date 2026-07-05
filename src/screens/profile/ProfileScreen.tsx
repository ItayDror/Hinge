import { useState } from 'react'
import clsx from 'clsx'
import { Avatar } from '../../components/Avatar'
import { PrimaryButton } from '../../components/PrimaryButton'
import { KnowYouMeter } from '../dailyquestion/KnowYouMeter'
import { StoryBubbleRow } from './StoryBubbleRow'
import { useAppState } from '../../state/AppStateContext'
import { placeholderPhoto } from '../../data/placeholders'

export function ProfileScreen() {
  const { dailyQuestion, answerDailyQuestion, skipDailyQuestion } = useAppState()
  const [answer, setAnswer] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-1">
      <h1 className="text-screen-title text-hinge-black">Profile</h1>

      <div className="mt-4 flex items-center gap-3">
        <Avatar name="You" photoUrl={placeholderPhoto('me-avatar')} size="lg" verified />
        <div>
          <p className="text-[17px] font-bold text-hinge-black">You, 28</p>
          <p className="text-caption text-hinge-grey">Profile editor — unchanged from today's Hinge</p>
        </div>
      </div>

      <div className="mt-5">
        <KnowYouMeter streak={dailyQuestion.streak} />
      </div>

      <div className="mt-4 rounded-card bg-hinge-grey-bg p-4">
        <p className="text-caption font-semibold text-hinge-grey">Today's question</p>
        {dailyQuestion.answeredToday ? (
          <p className="mt-2 text-body text-hinge-black">You already answered today — nice streak keeping. 🔥</p>
        ) : (
          <>
            <p className="mt-1 text-prompt-q text-hinge-black">{dailyQuestion.question.text}</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              rows={1}
              className="mt-3 max-h-24 w-full resize-none rounded-card bg-hinge-white p-3 text-body text-hinge-black placeholder:text-hinge-grey focus:outline-none"
            />
            <div className="mt-3 flex rounded-pill bg-hinge-white p-1">
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
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={skipDailyQuestion} className="min-h-11 px-2 text-body text-hinge-grey">
                Skip
              </button>
              <div className="flex-1">
                <PrimaryButton
                  label="Answer"
                  disabled={!answer.trim()}
                  onClick={() => {
                    answerDailyQuestion(answer.trim(), visibility)
                    setAnswer('')
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[13px] font-bold text-hinge-black">Past public answers</p>
        <StoryBubbleRow />
      </div>
    </div>
  )
}
