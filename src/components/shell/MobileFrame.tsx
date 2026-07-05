import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'

interface MobileFrameProps {
  children: ReactNode
}

const FRAME_WIDTH = 390
const FRAME_HEIGHT = 844

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0d0d0d] p-6">
      <div
        className="relative flex flex-col overflow-hidden rounded-[48px] border-[10px] border-[#0d0d0d] bg-hinge-white shadow-2xl"
        style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
      >
        {/* notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#0d0d0d]" />
        <StatusBar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}
