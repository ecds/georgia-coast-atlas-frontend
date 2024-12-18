import { simpleIslandShapes, inlandCountyShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

export const masks: StyleSpecification = {
  version: 8,
  sources: {
    counties: {
      type: "geojson",
      data: inlandCountyShapes,
      promoteId: "uuid",
    },
    islands: {
      type: "geojson",
      data: simpleIslandShapes,
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "simpleIslandsFill",
      source: "islands",
      type: "fill",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          "#68825C",
          "#4A5D41",
        ],
      },
    },
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
