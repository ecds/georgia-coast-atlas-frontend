import { simpleIslandShapes, inlandCountyShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

export const landColors = {
  island: "#4A5D41",
  activeIsland: "#68825C",
  county: "#414A5D",
  activeCounty: "#606C87",
  water: "#8191B2",
};

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
    // {
    //   id: "countyBoarder",
    //   source: "counties",
    //   type: "line",
    //   paint: {
    //     "line-color": landColors.activeCounty,
    //     "line-width": 2,
    //   },
    // },
  ],
};
