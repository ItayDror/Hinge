import { useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const dragging = useRef(false)

  if (!open) return null

  const handlePointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY
    dragging.current = true
  }
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startY.current === null) return
    const delta = e.clientY - startY.current
    if (delta > 0) setDragY(delta)
  }
  const handlePointerUp = () => {
    dragging.current = false
    if (dragY > 80) {
      onClose()
    }
    setDragY(0)
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-10 max-h-[85%] overflow-y-auto rounded-t-[24px] bg-hinge-white px-5 pb-6 pt-2.5 shadow-2xl',
          'animate-[sheet-up_0.22s_ease-out]'
        )}
        style={{ transform: `translateY(${dragY}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-pill bg-hinge-grey-light" />
        {title && <p className="mb-3 text-[17px] font-bold text-hinge-black">{title}</p>}
        {children}
      </div>
      <style>{`
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
