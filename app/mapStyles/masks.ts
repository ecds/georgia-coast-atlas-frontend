import { landColors } from "./areas";
import { maskShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

export const masks: StyleSpecification = {
  version: 8,
  sources: {
    masks: {
      type: "geojson",
      data: maskShapes,
    },
  },
  layers: [
    {
      id: "masks",
      source: "masks",
      type: "fill",
      paint: { "fill-color": landColors.water },
    },
  ],
};
