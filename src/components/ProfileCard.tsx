import clsx from 'clsx'

interface ProfileCardProps {
  photoUrl: string
  name: string
  age: number
  promptQuestion?: string
  promptAnswer?: string
  variant?: 'deck' | 'compact'
  /** e.g. "🏀 Also in Knicks in 5" — shared-space context chip over the photo. */
  sharedSpaceLabel?: string
}

export function ProfileCard({ photoUrl, name, age, promptQuestion, promptAnswer, variant = 'deck', sharedSpaceLabel }: ProfileCardProps) {
  if (variant === 'compact') {
    return (
      <div className="w-36 shrink-0 overflow-hidden rounded-card bg-hinge-white shadow-card">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="p-2.5">
          <p className="text-[15px] font-bold text-hinge-black">
            {name}, {age}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('relative h-full w-full overflow-hidden rounded-card bg-hinge-black shadow-card')}>
      <img src={photoUrl} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      {sharedSpaceLabel && (
        <span className="absolute left-4 top-4 rounded-pill bg-hinge-accent-soft px-3 py-1.5 text-[12px] font-bold text-hinge-black shadow-card">
          {sharedSpaceLabel}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pb-6 pt-16">
        <p className="text-profile-name text-hinge-white">
          {name}, {age}
        </p>
        {promptQuestion && promptAnswer && (
          <div className="mt-3 rounded-card bg-white/95 p-3">
            <p className="text-prompt-q text-hinge-grey">{promptQuestion}</p>
            <p className="mt-0.5 text-[17px] font-normal leading-snug text-hinge-black">{promptAnswer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
