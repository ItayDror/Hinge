import { useState } from 'react'
import { personById, portraitCard } from '../../data/people'
import { UpgradeBanner } from '../../components/UpgradeBanner'
import { PremiumSheet } from '../spaces/PremiumSheet'
import { StandoutProfileSheet } from './StandoutProfileSheet'
import { useAppState } from '../../state/AppStateContext'

// A curated set of people who aren't already surfaced in the main Discover
// deck, chats, or Likes You — Standouts is meant to feel like a distinct,
// hand-picked shortlist.
const STANDOUT_PERSON_IDS = ['priya', 'zoe', 'elena', 'marcus']

export function StandoutsScreen() {
  const { showToast, premiumUnlocked, unlockPremium } = useAppState()
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [openPersonId, setOpenPersonId] = useState<string | null>(null)
  const [paywallOpen, setPaywallOpen] = useState(false)

  const like = (personId: string, name: string) => {
    setLikedIds((prev) => (prev.includes(personId) ? prev : [...prev, personId]))
    showToast(`Like sent to ${name} 💌`)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-5 pb-2 pt-1">
        <h1 className="text-screen-title text-hinge-black">Standouts</h1>
        <p className="mt-0.5 text-body text-hinge-grey">A curated shortlist, refreshed daily</p>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {STANDOUT_PERSON_IDS.map((personId) => {
            const person = personById(personId)
            const liked = likedIds.includes(personId)
            return (
              <button
                key={personId}
                type="button"
                onClick={() => setOpenPersonId(personId)}
                className="overflow-hidden rounded-card bg-hinge-white text-left shadow-card"
              >
                <div className="relative">
                  <img src={portraitCard(person)} alt={person.name} className="aspect-[4/5] w-full object-cover" />
                  <span className="absolute left-2.5 top-2.5 rounded-pill bg-hinge-accent-soft px-2.5 py-1 text-[11px] font-bold text-hinge-accent">
                    ⭐ Standout
                  </span>
                  {liked && (
                    <span className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-pill bg-hinge-white shadow-card">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--hinge-accent)">
                        <path d="M12 20.5s-7.5-4.7-10-9.4C.6 8 2 4.5 5.4 3.6 8 2.9 10.4 4 12 6.3 13.6 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.1c-2.5 4.7-10 9.4-10 9.4Z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-[15px] font-bold text-hinge-black">
                    {person.name}, {person.age}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <UpgradeBanner
            copy={premiumUnlocked ? "You have Hinge+ — like every Standout, no limits." : 'With Hinge+, send unlimited likes to Standouts'}
            onUpgrade={() => setPaywallOpen(true)}
          />
        </div>
      </div>

      {openPersonId && (
        <StandoutProfileSheet
          personId={openPersonId}
          liked={likedIds.includes(openPersonId)}
          onLike={() => like(openPersonId, personById(openPersonId).name)}
          onClose={() => setOpenPersonId(null)}
        />
      )}
      <PremiumSheet open={paywallOpen} onClose={() => setPaywallOpen(false)} onUpgrade={unlockPremium} />
    </div>
  )
}
