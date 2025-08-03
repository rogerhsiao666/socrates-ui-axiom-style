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
          blue: '#00D4FF', // Web3 accent blue
          'blue-dark': '#00B8E6', // Darker blue for hover states
          purple: '#8B5CF6', // Web3 energy purple
          'purple-dark': '#7C3AED', // Darker purple for hover states
          yellow: '#f59e0b',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'digital-grid': 'linear-gradient(rgba(0, 255, 174, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 174, 0.03) 1px, transparent 1px)',
        'web3-mesh': 'radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'data-flow': 'dataFlow 3s ease-in-out infinite',
        'wallet-pulse': 'walletPulse 2s ease-in-out infinite',
        'energy-ripple': 'energyRipple 0.6s ease-out',
        'web3-glow': 'web3Glow 3s ease-in-out infinite',
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
        dataFlow: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
        },
        walletPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(0, 212, 255, 0.8)',
            transform: 'scale(1.02)'
          },
        },
        energyRipple: {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)'
          },
          '70%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)'
          },
          '100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)'
          },
        },
        web3Glow: {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(0, 255, 174, 0.2), 0 0 30px rgba(0, 212, 255, 0.1)'
          },
          '33%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)'
          },
          '66%': { 
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.3), 0 0 50px rgba(0, 255, 174, 0.1)'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
}