/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#10120f",
        panel: "#1b1e19",
        line: "#30352d",
        muted: "#a3aa9c",
        lime: "#d4f77d",
      },
    },
  },
  plugins: [],
};
