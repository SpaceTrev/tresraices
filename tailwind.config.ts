import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: '#2d1810',      // Rich chocolate brown
        federalBlue: '#3d2817',     // Darker warm brown
        lightBlue: '#A6CFD5',       // Soft blue-gray
        uclaBlue: '#467599',        // Muted blue
        mintGreen: '#C2E7D9',       // Soft mint
        cream: '#F2E9DF'            // Warm cream
      }
    },
  },
  plugins: [],
} satisfies Config
