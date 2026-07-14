import { AccentButton } from '../../components/AccentButton'

interface HingeRecommendationCardProps {
  suggestion: string
  onSend: () => void
}

// A chat-opener suggestion surfaced from the shared Daily Question / prompt
// content pipeline — presented like a Hinge prompt card: white, small label,
// serif quote.
export function HingeRecommendationCard({ suggestion, onSend }: HingeRecommendationCardProps) {
  return (
    <div className="rounded-card bg-hinge-white p-4 shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hinge-accent">💡 Hinge recommendation</p>
      <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">“{suggestion}”</p>
      <div className="mt-3">
        <AccentButton label="Send this" size="sm" onClick={onSend} />
      </div>
    </div>
  )
}
