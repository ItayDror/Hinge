import { useState } from 'react'
import { Pill } from '../../components/Pill'
import { Avatar } from '../../components/Avatar'
import { SpaceCard } from './SpaceCard'
import { PremiumSheet } from './PremiumSheet'
import { useAppState } from '../../state/AppStateContext'
import type { SpaceData } from '../../data/mockData'

const CATEGORIES = ['All', 'Sports', 'Local Events', 'Culture', 'Tech']

function LockedSpaceCard({ space, onTap }: { space: SpaceData; onTap: () => void }) {
  return (
    <button type="button" onClick={onTap} className="w-full rounded-card bg-hinge-white p-4 text-left shadow-card">
      <div className="flex items-start justify-between gap-3 opacity-60">
        <div>
          <p className="text-[17px] font-bold text-hinge-black">
            {space.title} {space.emoji}
          </p>
          <p className="mt-1 text-caption text-hinge-grey">
            {space.memberCount.toLocaleString()} in this space · closes in {space.closesInDays}d
          </p>
        </div>
        <div className="flex -space-x-2">
          {space.avatarPreviewUrls.map((url, i) => (
            <span key={i} className="overflow-hidden rounded-pill ring-2 ring-hinge-white" style={{ filter: 'blur(3px)' }}>
              <Avatar name={`m-${i}`} photoUrl={url} size="sm" />
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Pill label={space.category} tone="outline" />
        <span className="flex items-center gap-1 rounded-pill bg-hinge-black px-3 py-1.5 text-[11px] font-bold text-hinge-white">
          🔒 Hinge+
        </span>
      </div>
    </button>
  )
}

export function SpacesHomeScreen() {
  const { spaces, push, joinWaitlist, premiumUnlocked, unlockPremium } = useAppState()
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState<'New York, NY' | 'Boise, ID'>('New York, NY')
  const [paywallOpen, setPaywallOpen] = useState(false)

  const isFallbackLocation = location !== 'New York, NY'

  const matchesFilters = (s: SpaceData) =>
    isFallbackLocation ? s.status === 'interest-fallback' : category === 'All' || s.category === category

  const freeSpaces = spaces.filter((s) => (!s.premium || premiumUnlocked) && matchesFilters(s))
  const lockedSpaces = premiumUnlocked ? [] : spaces.filter((s) => s.premium && matchesFilters(s))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-5 pb-2 pt-1">
        <h1 className="text-screen-title text-hinge-black">Spaces</h1>
        <p className="mt-0.5 text-body text-hinge-grey">Conversations happening near you</p>
      </div>

      <div className="no-scrollbar shrink-0 overflow-x-auto px-5 pb-3">
        <div className="flex w-max gap-2">
          <Pill
            label={location}
            tone="outline"
            onClick={() => setLocation((l) => (l === 'New York, NY' ? 'Boise, ID' : 'New York, NY'))}
          />
          {CATEGORIES.map((c) => (
            <Pill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {isFallbackLocation && (
          <p className="mb-3 text-caption text-hinge-grey">
            Not many people nearby yet — here's what's trending by interest instead.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {freeSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onOpen={() => push({ screen: 'space-detail', params: { spaceId: space.id } })}
              onJoinWaitlist={() => joinWaitlist(space.id)}
            />
          ))}
        </div>

        {lockedSpaces.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-bold text-hinge-black">More spaces with Hinge+</p>
              <button
                type="button"
                onClick={() => setPaywallOpen(true)}
                className="rounded-pill bg-hinge-accent px-3.5 py-1.5 text-[12px] font-bold text-hinge-white"
              >
                Upgrade
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {lockedSpaces.map((space) => (
                <LockedSpaceCard key={space.id} space={space} onTap={() => setPaywallOpen(true)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PremiumSheet open={paywallOpen} onClose={() => setPaywallOpen(false)} onUpgrade={unlockPremium} />
    </div>
  )
}
