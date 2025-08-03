/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Space Grotesk', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
        'satoshi': ['Satoshi', 'sans-serif'],
      },
      colors: {
        // Custom prediction market theme colors
        primary: {
          50: '#f0fff4',
          100: '#dcfff0',
          200: '#bbffe1',
          300: '#86ffc6',
          400: '#4dffab',
          500: '#00FFAE', // Main brand green
          600: '#00e69d',
          700: '#00cc8c',
          800: '#00b37a',
          900: '#009968',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1a1a1a', // Card background
          900: '#121212', // Secondary background
          950: '#000000', // Main background (pure black)
        },
        accent: {
          green: '#00FFAE', // Primary green for highlights
          'green-dark': '#00D4AA', // Darker green for hover states
          red: '#FF3D5A', // Primary red for negative values
          'red-dark': '#E6354F', // Darker red for hover states
          blue: '#3b82f6',
          yellow: '#f59e0b',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 174, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 174, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}