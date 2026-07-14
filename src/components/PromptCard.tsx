import clsx from 'clsx'
import { CircleButton, HeartIcon } from './CircleButton'

interface PromptCardProps {
  question: string
  answer: string
  tone?: 'soft-bg' | 'plain'
  /** Show the real-Hinge floating heart circle inside the card. */
  onHeart?: () => void
  hearted?: boolean
}

/** Real-Hinge prompt card: white, small sans label, big serif answer. */
export function PromptCard({ question, answer, tone = 'soft-bg', onHeart, hearted }: PromptCardProps) {
  return (
    <div
      className={clsx(
        'relative rounded-card p-5 pb-6',
        tone === 'soft-bg' ? 'bg-hinge-white shadow-card' : 'bg-transparent'
      )}
    >
      <p className="text-[14px] font-semibold text-hinge-black">{question}</p>
      <p className="mt-3 font-serif text-serif-answer text-hinge-black">{answer}</p>
      {onHeart && (
        <div className="mt-4 flex justify-end">
          <CircleButton ariaLabel="Like this answer" size="sm" onClick={onHeart}>
            <HeartIcon size={20} filled={hearted} />
          </CircleButton>
        </div>
      )}
    </div>
  )
}
