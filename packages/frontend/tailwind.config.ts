import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: "var(--font-inter)",
      display: "var(--font-big-shoulders)",
    },
    fontSize: {
      "display-1": [
        "2.5rem",
        { lineHeight: "110%", letterSpacing: "8%", fontWeight: 700 },
      ],
      "display-2": [
        "2rem",
        { lineHeight: "110%", letterSpacing: "8%", fontWeight: 700 },
      ],
      "display-3": [
        "1.5rem",
        { lineHeight: "125%", letterSpacing: "8%", fontWeight: 700 },
      ],
      "heading-1": ["1.5rem", { lineHeight: "125%", fontWeight: 600 }],
      "heading-2": ["1.25rem", { lineHeight: "125%", fontWeight: 600 }],
      "heading-3": ["1.125rem", { lineHeight: "130%", fontWeight: 600 }],
      "body-1": ["0.875rem", { lineHeight: "150%", fontWeight: 400 }],
      "body-2": ["0.813rem", { lineHeight: "150%", fontWeight: 400 }],
      "body-3": ["0.75rem", { lineHeight: "150%", fontWeight: 400 }],
      "body-4": ["0.688rem", { lineHeight: "150%", fontWeight: 400 }],
    },

    extend: {
      colors: {
        brand: {
          100: "#E0E2FF",
          200: "#C7C9FE",
          300: "#ABABFC",
          400: "#8B81F8",
          500: "#7863F1",
          600: "#6A46E5",
          700: "#5C38CA",
          800: "#4B30A3",
          900: "#3F2E81",
          950: "#261B4B",
        },
        neutral: {
          100: "#FFFFFF",
          200: "#8A8A98",
          300: "#555563",
          400: "#2D2D3A",
          500: "#1F1F24",
          600: "#17171B",
          700: "#121215",
          800: "#0E0E11",
        },
        status: {
          danger: "#FE7C8C",
          warning: "#FDBE8A",
          success: "#B4EB6F",
        },
        semantic: {
          launch: "#E89D0F",
        },
      },
      backgroundImage: {
        // "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // "gradient-conic":background: radial-gradient(50% 64.29% at 50% 117.86%, #8B81F8 0%, rgba(63, 46, 129, 0) 100%);

        //   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "reward-pool-banner": "url('/reward-pool-bg.svg')",
        "leaderboard-coin": "url('/leaderboard-coin.svg')",
        "gradient-active-tab":
          "radial-gradient(50% 64.29% at 50% 117.86%, rgba(139, 129, 248, 0.75) 0%, rgba(63, 46, 129, 0) 75%)",
        "gradient-logo-glow":
          "radial-gradient(52.78% 67.86% at 50% 117.86%, rgba(139, 129, 248, 0.5) 0%, rgba(63, 46, 129, 0) 100%)",
        polkadots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
      },
      animation: {
        shake: "shake 0.25s linear infinite",
      },
      keyframes: {
        shake: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(5px, 5px) rotate(5deg)" },
          "50%": { transform: "translate(0, 0) rotate(0eg)" },
          "75%": { transform: "translate(-5px, 5px) rotate(-5deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
