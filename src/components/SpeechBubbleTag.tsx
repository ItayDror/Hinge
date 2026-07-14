// The grey speech-bubble context tag from the real Likes You screen
// ("Liked your photo") — rounded bubble with a small corner tail.
export function SpeechBubbleTag({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <span className="inline-block rounded-2xl bg-hinge-section px-4 py-2.5 font-serif text-[16px] italic text-hinge-black">
        {text}
      </span>
      <span
        className="absolute -bottom-1.5 left-3 h-3 w-3 bg-hinge-section"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
    </div>
  )
}
