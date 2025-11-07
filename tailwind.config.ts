import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: '#0D0221',
        federalBlue: '#0F084B',
        lightBlue: '#A6CFD5',
        uclaBlue: '#467599',
        mintGreen: '#C2E7D9',
        cream: '#F2E9DF'
      }
    },
  },
  plugins: [],
} satisfies Config
