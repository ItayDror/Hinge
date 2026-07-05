import clsx from 'clsx'

interface PromptCardProps {
  question: string
  answer: string
  tone?: 'soft-bg' | 'plain'
}

export function PromptCard({ question, answer, tone = 'soft-bg' }: PromptCardProps) {
  return (
    <div
      className={clsx(
        'rounded-card p-4',
        tone === 'soft-bg' ? 'bg-hinge-grey-bg shadow-card' : 'bg-transparent'
      )}
    >
      <p className="text-prompt-q text-hinge-grey">{question}</p>
      <p className="mt-1 text-prompt-a text-hinge-black">{answer}</p>
    </div>
  )
}
