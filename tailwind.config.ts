import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        black: "#1C1817",
        white: "#FDF9F6",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: {
          p: {
            lineHeight: "1.75rem",
            marginTop: "1.25rem",
            marginBottom: "1.25rem",
          },
          main: {
            "p:first-of-type:first-letter": {
              float: "left",
              fontFeatureSettings: '"ss06" !important',
              fontSize: "6rem",
              lineHeight: "3.5rem",
              fontWeight: "bold",
              padding: "1rem 0.75rem 0rem 0rem",
            },
          },
          '[type="search"]::-webkit-search-decoration': { display: "none" },
          '[type="search"]::-webkit-search-cancel-button': { display: "none" },
          '[type="search"]::-webkit-search-results-button': { display: "none" },
          '[type="search"]::-webkit-search-results-decoration': {
            display: "none",
          },
        },
      });
    }),
  ],
} satisfies Config;
