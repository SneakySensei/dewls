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
    },
    extend: {
      backgroundImage: {
        // "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // "gradient-conic":background: radial-gradient(50% 64.29% at 50% 117.86%, #8B81F8 0%, rgba(63, 46, 129, 0) 100%);

        //   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-active-tab":
          "radial-gradient(50% 64.29% at 50% 117.86%, rgba(139, 129, 248, 0.75) 0%, rgba(63, 46, 129, 0) 75%)",
      },
    },
  },
  plugins: [],
};
export default config;
