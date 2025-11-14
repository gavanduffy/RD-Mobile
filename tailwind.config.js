/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rd-primary': '#0066FF',
        'rd-dark': '#0A0E27',
        'rd-darker': '#050810',
        'rd-card': '#1A1F3A',
      },
    },
  },
  plugins: [],
}
