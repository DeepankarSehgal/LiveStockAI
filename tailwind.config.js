/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "#131B2E",
        cardBorder: "#1E293B",
        accentBlue: "#3B82F6",
        accentGreen: "#10B981",
        accentRed: "#EF4444",
        accentYellow: "#F59E0B",
        accentPurple: "#8B5CF6",
        neonCyan: "#06B6D4"
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
