import type { Config } from "tailwindcss";
import { topBarHeight, PLACE_TYPES } from "./app/config";
import plugin from "tailwindcss/plugin";

const bgColors = Object.keys(PLACE_TYPES).map(
  (type) => `bg-${PLACE_TYPES[type].bgColor}`
);
const textColors = Object.keys(PLACE_TYPES).map(
  (type) => `text-${PLACE_TYPES[type].textColor}`
);

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
          ".primary-content > p": {
            lineHeight: "1.75rem",
            marginTop: "1.25rem",
            marginBottom: "1.25rem",
          },
          main: {
            ".primary-content > p:first-of-type:first-letter": {
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
        "[maplibregl-popup-close-button], button.maplibregl-popup-close-button":
          {
            paddingRight: ".5rem !important",
          },
      });
    }),
  ],
  safelist: [
    `-top-[${topBarHeight}]`,
    `h-[calc(100vh-${topBarHeight})]`,
    "bg-blue-500",
    "text-6xl",
    "bg-red-100",
    ...bgColors,
    ...textColors,
  ],
} satisfies Config;
