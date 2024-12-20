import { simpleIslandShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

export const landColors = {
  island: "#4A5D41",
  activeIsland: "#68825C",
  county: "#414A5D",
  activeCounty: "#606C87",
};

export const masks: StyleSpecification = {
  version: 8,
  sources: {
    islandMasks: {
      type: "geojson",
      data: simpleIslandShapes,
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "simpleIslandsFill",
      source: "islandMasks",
      type: "fill",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          landColors.activeIsland,
          landColors.island,
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
          landColors.activeCounty,
          landColors.county,
        ],
      },
    },
  ],
};
