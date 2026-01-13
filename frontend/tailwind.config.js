/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      // bg-〇〇-100 と text-〇〇-700 をまとめて許可
      pattern: /(bg|text)-(red|blue|cyan|purple|slate|pink|green|orange|gray)-(100|700)/,
    },
  ],
  plugins: [],
}

