import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EE",
        ink: "#232220",
        clay: "#C17A55", // nálam
        teal: "#2F6B6B", // Ritánál
        line: "#E4DFD3",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
