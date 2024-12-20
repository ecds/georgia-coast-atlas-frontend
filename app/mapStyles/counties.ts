import { inlandCountyShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

export const counties: StyleSpecification = {
  version: 8,
  sources: {
    counties: {
      type: "geojson",
      data: inlandCountyShapes,
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "simpleCounties",
      source: "counties",
      type: "fill",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          "#606C87",
          "#414A5D",
        ],
      },
    },
  ],
};
