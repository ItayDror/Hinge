// TS mirror of the CSS custom properties in src/index.css, for the few cases
// that need JS-computed values rather than Tailwind classes or CSS vars.
//
// Palette sampled directly from real Hinge app screenshots (photos/ folder):
// plum accent from like-hearts/verified/match badges, warm near-white bg,
// sage from the Boost pill.
export const tokens = {
  color: {
    bg: '#FFFEFC',
    section: '#F1F0EE',
    black: '#1A1A1A',
    white: '#FFFFFF',
    grey: '#737373',
    greyLight: '#E8E6E2',
    greyBg: '#F1F0EE',
    accent: '#602D5C',
    accentSoft: '#F2EAF4',
    sage: '#B0C6C5',
  },
  radius: {
    card: 16,
    button: 9999,
    pill: 9999,
  },
  motion: {
    standardMs: 200, // 150-250ms ease-out per PRD Section 6
    revealMs: 400, // blur-to-reveal transitions
    celebratoryMs: 350, // Battle Card reveal payoff, 300-400ms
  },
} as const
