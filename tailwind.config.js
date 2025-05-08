/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F0E6",    // Warm beige
        foreground: "#2C5530",    // Forest green
        primary: "#C45B39",       // Rich terracotta
        secondary: "#2C5530",     // Forest green
        neutral: "#F5F0E6",       // Warm beige
        accent: "#D4A64A",        // Deep gold
      },
    },
  },
  plugins: [],
}