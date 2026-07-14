import type { Person } from '../data/people'

const stroke = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const CakeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M4 13h16v7H4zM6 13v-3h12v3M12 7v3M12 4.5v.01" {...stroke} />
  </svg>
)
const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="3.5" {...stroke} />
    <path d="M5.5 20c1-3.5 3.6-5.2 6.5-5.2s5.5 1.7 6.5 5.2" {...stroke} />
  </svg>
)
const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <rect x="4" y="8" width="16" height="11" rx="2" {...stroke} />
    <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" {...stroke} />
  </svg>
)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="m4 11 8-7 8 7M6 9.5V20h12V9.5" {...stroke} />
  </svg>
)
const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <circle cx="9" cy="9" r="3" {...stroke} />
    <path d="M3.5 20c.8-3 2.9-4.5 5.5-4.5s4.7 1.5 5.5 4.5M15.5 6.5a3 3 0 1 1 1 5.8M17 15.7c2 .5 3.2 1.9 3.7 4.3" {...stroke} />
  </svg>
)

interface VitalsCardProps {
  person: Person
}

/** The real-Hinge vitals/details card: top facts row + hairline-divided rows. */
export function VitalsCard({ person }: VitalsCardProps) {
  return (
    <div className="rounded-card bg-hinge-white p-1 shadow-card">
      <div className="flex items-center px-4 py-3.5">
        <span className="flex items-center gap-2 pr-4 text-[15px] text-hinge-black">
          <CakeIcon /> {person.age}
        </span>
        <span className="h-5 w-px bg-hinge-grey-light" />
        <span className="flex items-center gap-2 px-4 text-[15px] text-hinge-black">
          <PersonIcon /> {['maya', 'riley', 'morgan', 'quinn', 'kendall', 'val', 'sofia', 'elena', 'priya', 'zoe'].includes(person.id) ? 'Woman' : 'Man'}
        </span>
      </div>
      <div className="mx-4 h-px bg-hinge-grey-light" />
      <div className="flex items-center gap-3 px-4 py-3.5 text-[15px] text-hinge-black">
        <BriefcaseIcon /> {person.job}
      </div>
      <div className="mx-4 h-px bg-hinge-grey-light" />
      <div className="flex items-center gap-3 px-4 py-3.5 text-[15px] text-hinge-black">
        <HomeIcon /> {person.city}
      </div>
      <div className="mx-4 h-px bg-hinge-grey-light" />
      <div className="flex items-center gap-3 px-4 py-3.5 text-[15px] text-hinge-black">
        <PeopleIcon /> Monogamy
      </div>
    </div>
  )
}
