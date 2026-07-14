import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hinge-bg': 'var(--hinge-bg)',
        'hinge-section': 'var(--hinge-section)',
        'hinge-black': 'var(--hinge-black)',
        'hinge-white': 'var(--hinge-white)',
        'hinge-grey': 'var(--hinge-grey)',
        'hinge-grey-light': 'var(--hinge-grey-light)',
        'hinge-grey-bg': 'var(--hinge-grey-bg)',
        'hinge-accent': 'var(--hinge-accent)',
        'hinge-accent-soft': 'var(--hinge-accent-soft)',
        'hinge-sage': 'var(--hinge-sage)',
        'hinge-warn': 'var(--hinge-warn)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        'screen-title': ['32px', { fontWeight: '700', lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'profile-name': ['32px', { fontWeight: '700', lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'prompt-q': ['15px', { fontWeight: '600', lineHeight: '1.4' }],
        'prompt-a': ['26px', { fontWeight: '500', lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'serif-answer': ['26px', { fontWeight: '500', lineHeight: '1.18', letterSpacing: '-0.01em' }],
        body: ['15px', { fontWeight: '400', lineHeight: '1.5' }],
        caption: ['13px', { fontWeight: '400', lineHeight: '1.4' }],
        'button-label': ['16px', { fontWeight: '700', lineHeight: '1.2' }],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-button)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
      },
      spacing: {
        4.5: '18px',
      },
    },
  },
  plugins: [],
} satisfies Config
