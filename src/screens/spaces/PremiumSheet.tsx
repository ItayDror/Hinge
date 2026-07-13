import { useState } from 'react'
import clsx from 'clsx'
import { BottomSheet } from '../../components/BottomSheet'
import { PrimaryButton } from '../../components/PrimaryButton'

// Mock paywall — prices are illustrative; tapping Continue "unlocks" premium
// for the session so the demo can show both locked and unlocked states.
const TIERS = [
  { id: '1w', label: '1 week', price: '$9.99', per: '$9.99/wk' },
  { id: '1m', label: '1 month', price: '$24.99', per: '$6.25/wk', badge: 'Most popular' },
  { id: '6m', label: '6 months', price: '$89.99', per: '$3.75/wk', badge: 'Best value' },
]

interface PremiumSheetProps {
  open: boolean
  onClose: () => void
  onUpgrade: () => void
}

export function PremiumSheet({ open, onClose, onUpgrade }: PremiumSheetProps) {
  const [tier, setTier] = useState('1m')

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pb-2 text-center">
        <span className="inline-flex items-center rounded-pill bg-hinge-black px-4 py-1.5 text-[14px] font-black tracking-tight text-hinge-white">
          hinge<span className="text-hinge-accent">+</span>
        </span>
        <p className="mt-3 text-[20px] font-bold text-hinge-black">Unlock every Space</p>
        <p className="mt-1 text-body text-hinge-grey">
          Join unlimited Spaces, see everyone's daily answers, and never miss a moment before it closes.
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            className={clsx(
              'relative flex-1 rounded-card border-2 p-3 text-center transition-colors',
              tier === t.id ? 'border-hinge-black bg-hinge-grey-bg' : 'border-hinge-grey-light bg-hinge-white'
            )}
          >
            {t.badge && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-hinge-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-hinge-white">
                {t.badge}
              </span>
            )}
            <p className="text-[14px] font-bold text-hinge-black">{t.label}</p>
            <p className="mt-0.5 text-[16px] font-bold text-hinge-black">{t.price}</p>
            <p className="text-[11px] text-hinge-grey">{t.per}</p>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <PrimaryButton
          label="Continue"
          onClick={() => {
            onUpgrade()
            onClose()
          }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] text-hinge-grey">Demo paywall — no payment is processed.</p>
    </BottomSheet>
  )
}
