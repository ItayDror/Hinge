export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-hinge-black shrink-0">
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="0.5" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 10.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm-3-3.4a4.3 4.3 0 0 1 6 0l-1 1a2.85 2.85 0 0 0-4 0l-1-1Zm-2.6-2.6a7.9 7.9 0 0 1 11.2 0l-1 1a6.45 6.45 0 0 0-9.2 0l-1-1Z"
            fill="currentColor"
          />
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="1.3" fill="currentColor" />
          <rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
