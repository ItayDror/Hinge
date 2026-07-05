import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hinge-black': 'var(--hinge-black)',
        'hinge-white': 'var(--hinge-white)',
        'hinge-grey': 'var(--hinge-grey)',
        'hinge-grey-light': 'var(--hinge-grey-light)',
        'hinge-grey-bg': 'var(--hinge-grey-bg)',
        'hinge-accent': 'var(--hinge-accent)',
        'hinge-accent-soft': 'var(--hinge-accent-soft)',
        'hinge-warn': 'var(--hinge-warn)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'screen-title': ['28px', { fontWeight: '700', lineHeight: '1.2' }],
        'profile-name': ['24px', { fontWeight: '700', lineHeight: '1.25' }],
        'prompt-q': ['15px', { fontWeight: '600', lineHeight: '1.4' }],
        'prompt-a': ['20px', { fontWeight: '400', lineHeight: '1.35' }],
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
      },
      spacing: {
        4.5: '18px',
      },
    },
  },
  plugins: [],
} satisfies Config
