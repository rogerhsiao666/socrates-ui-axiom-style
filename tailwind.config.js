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
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // SocratesStudio Brand Colors - Modern Humanistic Design
        brand: {
          50: '#FFFBF0',
          100: '#FEF3C7',
          200: '#FDE68A', 
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37', // Wisdom Gold - Main brand color
          600: '#B7950F',
          700: '#92780C',
          800: '#745F09',
          900: '#5D4C07',
        },
        
        // Sophisticated Neutrals
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B', // Card backgrounds
          900: '#0F172A', // Deep backgrounds
          950: '#020617', // Darkest background
        },
        
        // Deep Trust Blue
        navy: {
          50: '#F0F4F8',
          100: '#E1E9F1',
          200: '#C3D3E3',
          300: '#A5BDD5',
          400: '#87A7C7',
          500: '#2E3B59', // Deep Trust Blue
          600: '#253047',
          700: '#1C2435',
          800: '#131823',
          900: '#0A0C11',
        },
        
        // Accent Colors
        accent: {
          amber: '#F59E0B',    // Dawn Orange
          emerald: '#059669',  // Forest Green
          rose: '#DC2626',     // Sunset Red
          sky: '#3B82F6',      // Sky Blue
          violet: '#8B5CF6',   // Royal Purple
        },
        
        // Semantic Colors
        success: '#059669',
        warning: '#F59E0B', 
        error: '#DC2626',
        info: '#3B82F6',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'soft-gradient': 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'bento-grid': 'radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
      },
      
      animation: {
        // Gentle, human-centered animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-gentle': 'scaleGentle 0.3s ease-out',
        'glow-soft': 'glowSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounceGentle 1s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleGentle: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowSoft: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' },
        },
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
      
      backgroundSize: {
        'bento': '20px 20px',
      },
      
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.12)',
        'large': '0 8px 40px 0 rgba(0, 0, 0, 0.16)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
}