import { Pill } from '../../components/Pill'

const AVAILABILITY_TAGS = ['Generally free weekday evenings', 'Weekends', 'Flexible']

const SELECTED_TAG_COPY: Record<string, string> = {
  'Generally free weekday evenings': "You're generally free on weekday evenings",
  Weekends: "You're generally free on weekends",
  Flexible: "You're flexible with timing",
}

interface MutualReadinessCardProps {
  matchName: string
  availabilityTagSelected?: string
  onSelectTag: (tag: string) => void
}

// Prominent celebration card for mutual date-readiness — replaces the old
// buried grey system-text lines so the milestone, the next step, and the
// availability choice all read at a glance.
export function MutualReadinessCard({ matchName, availabilityTagSelected, onSelectTag }: MutualReadinessCardProps) {
  return (
    <div className="rounded-card bg-hinge-accent-soft p-5 text-center shadow-card">
      <span className="text-[32px]">🎉</span>
      <p className="mt-2 font-serif text-[22px] font-semibold text-hinge-black">You're both ready for a date</p>
      <p className="mt-1 text-caption text-hinge-grey">
        You and {matchName} each said you're ready to take this further.
      </p>

      <div className="mx-auto my-4 h-px w-24 bg-hinge-accent/30" />

      {availabilityTagSelected ? (
        <div className="rounded-pill bg-hinge-white px-4 py-2 text-caption font-semibold text-hinge-black">
          🗓 {SELECTED_TAG_COPY[availabilityTagSelected] ?? availabilityTagSelected}
        </div>
      ) : (
        <>
          <p className="text-caption font-semibold text-hinge-black">When are you generally free?</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {AVAILABILITY_TAGS.map((tag) => (
              <Pill key={tag} label={tag} onClick={() => onSelectTag(tag)} />
            ))}
          </div>
        </>
      )}

      <p className="mt-4 text-caption font-semibold text-hinge-accent">Maybe it's time to swap numbers 💬</p>
    </div>
  )
}
