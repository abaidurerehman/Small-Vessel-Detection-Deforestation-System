/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
        ocean: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          900: "#0c4a6e",
        },
        dark: {
          900: "#050810",
          800: "#090d1a",
          700: "#0d1424",
          600: "#111827",
          500: "#1f2937",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-forest": "radial-gradient(at 40% 20%, #052e16 0px, transparent 50%), radial-gradient(at 80% 0%, #0c4a6e 0px, transparent 50%), radial-gradient(at 0% 50%, #14532d 0px, transparent 50%)",
        "mesh-ocean": "radial-gradient(at 40% 20%, #0c4a6e 0px, transparent 50%), radial-gradient(at 80% 0%, #052e16 0px, transparent 50%), radial-gradient(at 0% 50%, #1e1b4b 0px, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
