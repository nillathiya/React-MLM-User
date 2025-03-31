// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#1E1E2E", // Custom background color
        darkCard: "#273142", // Custom card background
        darkText: "#d1d5db", // Custom text color
        darkBorder: "#44475A", // Custom border color
        darkPrimary: "#6272A4", // Custom primary color
        // bg-gray-700
        darkHover: "#374151", 
        darkTertiary:"#374151",
        darkBgHover: "#374151", // Background hover color
        darkSecondary: "#2D3748", // Secondary background
      },
    },    
  },
  plugins: [],
};