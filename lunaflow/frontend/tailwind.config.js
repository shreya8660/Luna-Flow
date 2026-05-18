// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ─── LunaFlow Custom Colors ────────────────────────────
      colors: {
        luna: {
          50:  "#fff0f6",
          100: "#ffe3ef",
          200: "#ffc9e0",
          300: "#ff9dc2",
          400: "#ff5f9c",
          500: "#f72b7a",
          600: "#e7065a",
          700: "#c8004a",
          800: "#a60040",
          900: "#8a0039",
        },
        rose: {
          blush:   "#FBD5E5",
          petal:   "#F9A8C9",
          deep:    "#EC4899",
          soft:    "#FFF0F6",
        },
        lavender: {
          soft:   "#E9D5FF",
          mid:    "#C4B5FD",
          deep:   "#8B5CF6",
        },
        peach: {
          soft:   "#FEE2E2",
          mid:    "#FECACA",
          warm:   "#FCA5A5",
        },
      },

      // ─── Fonts ────────────────────────────────────────────
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        accent:  ["DM Sans", "sans-serif"],
      },

      // ─── Animations ───────────────────────────────────────
      animation: {
        "float":     "float 6s ease-in-out infinite",
        "pulse-soft":"pulse-soft 2s ease-in-out infinite",
        "fade-in":   "fadeIn 0.5s ease-in-out",
        "slide-up":  "slideUp 0.4s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%":      { opacity: 0.7 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      },

      // ─── Box Shadow ───────────────────────────────────────
      boxShadow: {
        "pink-soft":  "0 4px 24px rgba(247, 43, 122, 0.12)",
        "pink-md":    "0 8px 32px rgba(247, 43, 122, 0.2)",
        "glass":      "0 8px 32px rgba(0, 0, 0, 0.08)",
        "card":       "0 2px 16px rgba(0, 0, 0, 0.06)",
      },

      // ─── Backdrop Blur ────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },

      // ─── Border Radius ────────────────────────────────────
      borderRadius: {
        "2xl":  "1rem",
        "3xl":  "1.5rem",
        "4xl":  "2rem",
      },
    },
  },
  plugins: [],
};
