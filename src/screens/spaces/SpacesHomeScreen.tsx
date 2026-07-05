import { useState } from 'react'
import { Pill } from '../../components/Pill'
import { SpaceCard } from './SpaceCard'
import { useAppState } from '../../state/AppStateContext'

const CATEGORIES = ['All', 'Sports', 'Local Events', 'Culture', 'Tech']

export function SpacesHomeScreen() {
  const { spaces, push, joinWaitlist } = useAppState()
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState<'New York, NY' | 'Boise, ID'>('New York, NY')

  const isFallbackLocation = location !== 'New York, NY'

  const visibleSpaces = isFallbackLocation
    ? spaces.filter((s) => s.status === 'interest-fallback')
    : spaces.filter((s) => category === 'All' || s.category === category)

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
          {visibleSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onOpen={() => push({ screen: 'space-detail', params: { spaceId: space.id } })}
              onJoinWaitlist={() => joinWaitlist(space.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
