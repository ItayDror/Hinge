// TS mirror of the CSS custom properties in src/index.css, for the few cases
// that need JS-computed values (blur interpolation, cross-fade timing) rather
// than plain Tailwind classes or CSS vars.
//
// ACCENT COLOR FLAG: `accent` below is a best-effort approximation per PRD
// Section 2.1 / Section 9 — verify against real Hinge app screenshots before
// final presentation and adjust both here and in index.css if it has drifted.
export const tokens = {
  color: {
    black: '#1A1A1A',
    white: '#FFFFFF',
    grey: '#666666',
    greyLight: '#E8E6E2',
    greyBg: '#F5F4F1',
    accent: '#E15B3F',
    accentSoft: '#FBE5DE',
    warn: '#C75B2E',
  },
  radius: {
    card: 20,
    button: 12,
    pill: 9999,
  },
  motion: {
    standardMs: 200, // 150-250ms ease-out per PRD Section 6
    revealMs: 400, // blur-to-reveal transitions
    celebratoryMs: 350, // Battle Card reveal payoff, 300-400ms
  },
} as const
