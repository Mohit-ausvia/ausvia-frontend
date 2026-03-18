import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
      keyframes: {
        tick: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        tick: "tick 30s linear infinite",
      },
      colors: {
        base: "#0A0A0A",
        teal: "#0E7C86",
        tealLight: "#D6F0F2",
        gold: "#C49A22",
        textPrimary: "#F5F5F0",
        textSubdued: "#6B7280",
        warning: "#C0392B",
        warningLight: "#FDECEA",
        safe: "#1A6B3C",
        safeLight: "#E8F5EE",
        rule: "#1F1F1F",
      },
    },
  },
  plugins: [],
};

export default config;
