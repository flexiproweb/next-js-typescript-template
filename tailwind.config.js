/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // 8-Point Grid System
      spacing: {
        '4': '0.25rem',    // 4px
        '8': '0.5rem',     // 8px
        '12': '0.75rem',   // 12px
        '16': '1rem',      // 16px
        '20': '1.25rem',   // 20px
        '24': '1.5rem',    // 24px
        '32': '2rem',      // 32px
        '40': '2.5rem',    // 40px
        '48': '3rem',      // 48px
        '56': '3.5rem',    // 56px
        '64': '4rem',      // 64px
        '72': '4.5rem',    // 72px
        '80': '5rem',      // 80px
        '88': '5.5rem',    // 88px
        '96': '6rem',      // 96px
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5bcff',
          400: '#8197ff',
          500: '#5d6eff',
          600: '#4338f5',
          700: '#20305F',
          800: '#1e2956',
          900: '#1a244a',
        },
        secondary: {
          50: '#f0fcff',
          100: '#e0f8ff',
          200: '#baf1ff',
          300: '#7de7ff',
          400: '#38d6ff',
          500: '#189DD8',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        tertiary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F37C21',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Futuristic Accent Colors
        neon: {
          green: '#00FFA3',
          cyan: '#00E5FF',
          purple: '#B537F2',
          pink: '#FF1744',
          blue: '#2196F3',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        }
      },
      fontFamily: {
        // Override all font families to use Helvetica Neue
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        primary: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        secondary: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        tertiary: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // Futuristic Animations
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 163, 0.2), 0 0 10px rgba(0, 255, 163, 0.2), 0 0 15px rgba(0, 255, 163, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 255, 163, 0.4), 0 0 20px rgba(0, 255, 163, 0.4), 0 0 30px rgba(0, 255, 163, 0.4)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 255, 163, 0.3)',
        'glow': '0 0 20px rgba(0, 255, 163, 0.4)',
        'glow-lg': '0 0 30px rgba(0, 255, 163, 0.5)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor',
      }
    },
  },
  plugins: [],
}
