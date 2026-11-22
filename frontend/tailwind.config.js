/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C18', // Deep space navy base
          900: '#0B132B', // Dark navy background
          850: '#111D42', // Card surface
          800: '#1C2B54', // Border and lighter surface
          700: '#2C3E6B', // Hover states
          600: '#3D548C',
          500: '#5472B5',
        },
        gemini: {
          blue: '#4E95FF',
          cyan: '#38BDF8',
          purple: '#818CF8',
          glow: 'rgba(56, 189, 248, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
