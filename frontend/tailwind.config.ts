import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e02041",
        "gray-soft": "#f0f0f5",
        "gray-border": "#dcdce6",
        "gray-text": "#737380",
        "gray-dark": "#41414d",
        "gray-icon": "#a8a8b3",
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
