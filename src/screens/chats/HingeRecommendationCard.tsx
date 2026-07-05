import { AccentButton } from '../../components/AccentButton'

interface HingeRecommendationCardProps {
  suggestion: string
  onSend: () => void
}

// A chat-opener suggestion surfaced from the shared Daily Question / prompt
// content pipeline (PRD Section 1: "feeds Hinge's matching algorithm and
// chat-opener suggestions"). Styled like the Space Promo Card's one
// deliberate use of color-as-background, since this is likewise a single
// highest-priority suggested action for the screen.
export function HingeRecommendationCard({ suggestion, onSend }: HingeRecommendationCardProps) {
  return (
    <div className="rounded-card bg-hinge-accent-soft p-4">
      <p className="text-caption font-semibold text-hinge-accent">💡 Hinge recommendation</p>
      <p className="mt-1.5 text-body text-hinge-black">"{suggestion}"</p>
      <div className="mt-3">
        <AccentButton label="Send this" size="sm" onClick={onSend} />
      </div>
    </div>
  )
}
