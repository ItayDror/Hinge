// Decorative Discover filter row matching the real app's top bar:
// sliders icon + hairline pills, with one active (black-filled) pill.
export function FilterBar() {
  return (
    <div className="flex items-center gap-2 px-5 pb-3 pt-1">
      <button type="button" aria-label="Filters" className="shrink-0 text-hinge-black">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h10M18 17h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      <div className="no-scrollbar flex-1 overflow-x-auto">
        <div className="flex w-max gap-2">
          <span className="rounded-pill border border-hinge-grey-light bg-hinge-white px-4 py-2 text-[14px] font-semibold text-hinge-black">
            Signals
          </span>
          <span className="rounded-pill bg-hinge-black px-4 py-2 text-[14px] font-semibold text-hinge-white">
            Age ⌄
          </span>
          <span className="rounded-pill border border-hinge-grey-light bg-hinge-white px-4 py-2 text-[14px] font-semibold text-hinge-black">
            Height ⌄
          </span>
          <span className="rounded-pill border border-hinge-grey-light bg-hinge-white px-4 py-2 text-[14px] font-semibold text-hinge-black">
            Dating intention ⌄
          </span>
        </div>
      </div>
    </div>
  )
}
