import { useEffect } from 'react'
import clsx from 'clsx'

interface ToastBannerProps {
  message: string
  visible: boolean
  onDismiss: () => void
  durationMs?: number
}

export function ToastBanner({ message, visible, onDismiss, durationMs = 2200 }: ToastBannerProps) {
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(t)
  }, [visible, durationMs, onDismiss])

  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-x-0 bottom-[76px] z-50 flex justify-center px-5 transition-all duration-200',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      <div className="rounded-pill bg-hinge-black px-4 py-2.5 text-[13px] font-semibold text-hinge-white shadow-card">
        {message}
      </div>
    </div>
  )
}
