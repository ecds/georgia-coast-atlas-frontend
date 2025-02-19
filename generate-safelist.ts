import * as fs from "fs";
import { PLACE_TYPES, topBarHeight } from "./app/config";

const safeClasses = [
  "2xl:col-span-11",
  `-top-[${topBarHeight}]`,
  `h-[calc(100vh-${topBarHeight})]`,
  "bg-blue-500",
  "text-6xl",
  "bg-red-100",
  "bg-county",
  "bg-active-county/70",
];

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

fs.writeFile(
  "safelist.txt",
  [
    ...safeClasses,
    ...bgColors,
    ...textColors,
    ...textBgColors,
    ...bgTextColors,
  ].join("\n"),
  (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Safelist created");
    }
  }
);
