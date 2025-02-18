import type { Config } from "tailwindcss";
import { topBarHeight, PLACE_TYPES } from "./app/config";
import { landColors } from "./app/mapStyles";
import plugin from "tailwindcss/plugin";

const bgColors = Object.keys(PLACE_TYPES).map(
  (type) => `bg-${PLACE_TYPES[type].bgColor}`
);
const textColors = Object.keys(PLACE_TYPES).map(
  (type) => `text-${PLACE_TYPES[type].textColor}`
);
const textBgColors = Object.keys(PLACE_TYPES).map(
  (type) => `text-${PLACE_TYPES[type].bgColor}`
);
const bgTextColors = Object.keys(PLACE_TYPES).map(
  (type) => `bg-${PLACE_TYPES[type].textColor}`
);

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
      },
      colors: {
        black: "#1C1817",
        white: "#FDF9F6",
        "costal-green": "#4A5D41",
        island: landColors.island,
        activeIsland: landColors.activeIsland,
        county: landColors.county,
        activeCounty: landColors.activeCounty,
        water: landColors.water,
      },
    },
  },
  future: {},
  plugins: [
    plugin(({ addBase }) => {
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
          '[type="checkbox"]:checked': {
            backgroundColor: "currentColor",
            backgroundPosition: "50%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "0.55em 0.55em",
            borderColor: "transparent",
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3E%3C/svg%3E")`,
            "-webkit-print-color-adjust": "exact",
            printColorAdjust: "exact",
          },
          '[type="checkbox"]': {
            "--tw-shadow": "0 0 #0000",
            "-webkit-appearance": "none",
            "-moz-appearance": "none",
            appearance: "none",
            backgroundColor: "#fff",
            backgroundOrigin: "border-box",
            borderColor: "#6b7280",
            borderWidth: "1px",
            display: "inline-block",
            flexShrink: "0",
            height: "1rem",
            padding: "0",
            "-webkit-print-color-adjust": "exact",
            printColorAdjust: "exact",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            userSelect: "none",
            verticalAlign: "middle",
            width: "1rem",
          },
        },
        "[maplibregl-popup-close-button], button.maplibregl-popup-close-button":
          {
            paddingRight: ".5rem !important",
          },
        "[maplibregl-popup-content], .tooltip .maplibregl-popup-content": {
          background: "black",
        },
        "[maplibregl-popup-tip-left], .tooltip.maplibregl-popup-anchor-left .maplibregl-popup-tip":
          {
            borderRightColor: "black",
          },
        "[maplibregl-popup-tip-right], .tooltip.maplibregl-popup-anchor-right .maplibregl-popup-tip":
          {
            borderLeftColor: "black",
          },
      });
    }),
  ],
  safelist: [
    "2xl:col-span-11",
    `-top-[${topBarHeight}]`,
    `h-[calc(100vh-${topBarHeight})]`,
    "bg-blue-500",
    "text-6xl",
    "bg-red-100",
    "bg-county",
    "bg-activeCounty/70",
    ...bgColors,
    ...textColors,
    ...textBgColors,
    ...bgTextColors,
  ],
} satisfies Config;
