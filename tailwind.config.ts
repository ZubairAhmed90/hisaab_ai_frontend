import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#185FA5',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#1D9E75',
          foreground: '#ffffff',
        },
        lime: '#E8FF57',
        surface: '#F4F7F5',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        sidebar: '#1A1A2E',
        muted: {
          DEFAULT: '#8A94A6',
          foreground: '#8A94A6',
        },
        danger: '#EF4444',
        success: '#1D9E75',
        warning: '#F59E0B',
        border: '#E2E8F0',
        input: '#F4F7F5',
        ring: '#185FA5',
        background: '#F4F7F5',
        foreground: '#111827',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#F4F7F5',
          foreground: '#111827',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px 0 rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
