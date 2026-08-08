/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        card: {
          DEFAULT: '#161b27',
          hover: '#1c2235',
        },
        border: '#252d40',
        gold: {
          DEFAULT: '#e2b96f',
          muted: '#a07c42',
        },
        text: {
          primary: '#eef0f6',
          secondary: '#8892aa',
          muted: '#4a5268',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        gold: '0 0 0 1px rgba(226, 185, 111, 0.2), 0 4px 24px rgba(226, 185, 111, 0.08)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
      },
    },
  },
  plugins: [],
}