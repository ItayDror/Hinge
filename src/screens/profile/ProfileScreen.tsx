import { Avatar } from '../../components/Avatar'
import { placeholderPhoto } from '../../data/placeholders'

// Not reachable from the bottom nav in this prototype — the redesign's story
// lives in Spaces. Kept minimal so the route still renders if linked.
export function ProfileScreen() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-1">
      <h1 className="text-screen-title text-hinge-black">Profile</h1>

      <div className="mt-4 flex items-center gap-3">
        <Avatar name="You" photoUrl={placeholderPhoto('me-avatar')} size="lg" verified />
        <div>
          <p className="text-[17px] font-bold text-hinge-black">You, 28</p>
          <p className="text-caption text-hinge-grey">Profile editor — unchanged from today's Hinge</p>
        </div>
      </div>

      <div className="mt-5 rounded-card bg-hinge-white p-4 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hinge-accent">✨ Spaces</p>
        <p className="mt-2 font-serif text-[20px] leading-snug text-hinge-black">
          Your answers in Spaces are how people find you.
        </p>
        <p className="mt-2 text-caption text-hinge-grey">
          Join a Space, answer its question, and your profile opens to people who connect with what you said.
        </p>
      </div>
    </div>
  )
}
