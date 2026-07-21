/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        village: {
          50:  '#f2f9f2',
          100: '#e1f3e2',
          200: '#c2e7c4',
          300: '#94d498',
          400: '#5ebb64',
          500: '#2E7D32', // Primary Village Green
          600: '#256628',
          700: '#1c4d1e',
          800: '#153a16',
          900: '#0c220c',
        },
        harvest: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFB300', // Secondary Harvest Gold
          600: '#e6a100',
          700: '#b37d00',
          800: '#8c6000',
        },
        trust: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#1565C0', // Accent Trust Blue
          600: '#0d47a1',
          700: '#0a367c',
        },
        primary: {
          50:  '#f2f9f2',
          100: '#e1f3e2',
          200: '#c2e7c4',
          500: '#2E7D32',
          600: '#256628',
          700: '#1c4d1e',
          800: '#153a16',
        },
        amber: {
          500: '#FFB300',
          600: '#e6a100',
        },
        canvas: '#F8FAF5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeZoom: {
          '0%': { opacity: '0', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.03)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(255, 179, 0, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(255, 179, 0, 0.8))' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        fadeInUp: 'fadeInUp 0.5s ease-out both',
        scaleIn: 'scaleIn 0.4s ease-out both',
        fadeZoom: 'fadeZoom 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.5s infinite',
        floatSlow: 'floatSlow 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s infinite',
      },
      boxShadow: {
        'village-card': '0 4px 20px -2px rgba(46, 125, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'village-hover': '0 12px 30px -4px rgba(46, 125, 50, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        'gold-glow': '0 8px 25px -3px rgba(255, 179, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
