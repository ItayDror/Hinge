// The real-Hinge upgrade strip: grey card, black "Upgrade" pill, copy line.
interface UpgradeBannerProps {
  copy: string
  onUpgrade: () => void
}

export function UpgradeBanner({ copy, onUpgrade }: UpgradeBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-hinge-section p-3.5">
      <button
        type="button"
        onClick={onUpgrade}
        className="shrink-0 rounded-pill bg-hinge-black px-5 py-2.5 text-[14px] font-bold text-hinge-white active:opacity-80"
      >
        Upgrade
      </button>
      <p className="text-[14px] leading-snug text-hinge-black">{copy}</p>
    </div>
  )
}
