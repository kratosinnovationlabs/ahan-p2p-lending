/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'Courier', 'monospace'],
      },
      colors: {
        'neo-pink': '#FF005C',
        'neo-cyan': '#00F0FF',
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-yellow': '#FFFF00',
        'neo-green': '#00FF00',
      },
      boxShadow: {
        'brutal': '6px 6px 0 #000000',
        'brutal-lg': '10px 10px 0 #000000',
        'brutal-pink': '6px 6px 0 #FF005C',
        'brutal-cyan': '6px 6px 0 #00F0FF',
      },
    },
  },
  plugins: [],
}
