import clsx from 'clsx'
import { placeholderPhoto } from '../../data/placeholders'

// Illustrative past-public-answer bubbles — mock timestamp comparison only,
// no real 24h expiry logic per PRD Section 4.3.
const PAST_ANSWERS = [
  { id: 'pa1', label: 'Podcast pick', hoursAgo: 3 },
  { id: 'pa2', label: 'Two truths', hoursAgo: 20 },
  { id: 'pa3', label: 'Coffee or tea', hoursAgo: 30 },
  { id: 'pa4', label: 'Song stuck', hoursAgo: 50 },
]

export function StoryBubbleRow() {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="flex w-max gap-3 px-0.5 py-1">
        {PAST_ANSWERS.map((a) => {
          const expired = a.hoursAgo >= 24
          return (
            <div key={a.id} className="flex w-16 flex-col items-center gap-1">
              <span
                className={clsx(
                  'flex h-14 w-14 items-center justify-center overflow-hidden rounded-pill p-0.5',
                  expired ? 'bg-hinge-grey-light' : 'bg-hinge-accent'
                )}
              >
                <img
                  src={placeholderPhoto(a.id)}
                  alt={a.label}
                  className={clsx('h-full w-full rounded-pill object-cover', expired && 'grayscale opacity-60')}
                />
              </span>
              <span className="truncate text-[11px] font-medium text-hinge-grey">{expired ? 'Expired' : a.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
