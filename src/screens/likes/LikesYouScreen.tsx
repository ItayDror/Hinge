// Existing Hinge tab — unchanged per PRD Section 3/4. Minimal static stub since
// this redesign doesn't touch Likes You; included for nav completeness only.
export function LikesYouScreen() {
  return (
    <div className="flex flex-1 flex-col px-5 pt-1">
      <h1 className="text-screen-title text-hinge-black">Likes You</h1>
      <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-[17px] font-bold text-hinge-black">No new likes yet</p>
        <p className="text-body text-hinge-grey">Unchanged from today's Hinge — not part of this redesign.</p>
      </div>
    </div>
  )
}
