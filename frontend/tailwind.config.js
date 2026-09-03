/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-elevated': 'var(--color-surface-elevated)',
          'surface-hover': 'var(--color-surface-hover)',
          border: 'var(--color-border)',
          'border-highlight': 'var(--color-border-highlight)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          'text-dim': 'var(--color-text-dim)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-glow': 'var(--color-primary-glow)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          badge: 'var(--color-badge-bg)',
          'badge-text': 'var(--color-badge-text)',
        }
      },
      backgroundImage: {
        'metallic-brushed': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.2) 100%)',
        'steel-shine': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        'cyber-neon': 'linear-gradient(135deg, #00E5FF 0%, #7C3AED 100%)',
        'gold-seal': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      boxShadow: {
        'glass-edge': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'metal-emboss': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(0, 0, 0, 0.4)',
        'neon-glow': '0 0 25px rgba(0, 229, 255, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'Kanit', 'Noto Sans SC', 'Noto Sans JP', 'Noto Sans Myanmar', 'sans-serif'],
        display: ['Outfit', 'Kanit', 'sans-serif'],
      },
      animation: {
        'steel-pulse': 'steelPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine-sweep': 'shineSweep 4s ease-in-out infinite',
      },
      keyframes: {
        steelPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shineSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
