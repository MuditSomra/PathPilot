/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pilot: {
          bg: "#0b1220",
          surface: "#111a2e",
          accent: "#5eead4",
          accentDark: "#14b8a6",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      keyframes: {
        "cell-visit": {
          "0%": { transform: "scale(0.35)", borderRadius: "50%", opacity: "0.4" },
          "60%": { transform: "scale(1.08)", borderRadius: "6px", opacity: "1" },
          "100%": { transform: "scale(1)", borderRadius: "4px", opacity: "1" },
        },
        "cell-path": {
          "0%": { transform: "scale(0.6)", opacity: "0.5" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "cell-visit": "cell-visit 0.35s ease-out forwards",
        "cell-path": "cell-path 0.4s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
