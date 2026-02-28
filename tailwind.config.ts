import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          500: "#7C3AED",
          600: "#6D28D9"
        }
      }
    }
  },
  plugins: []
};

export default config;
