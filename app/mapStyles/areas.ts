import { areaShapes } from "./sources";
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

export const landColors = {
  island: "#68825C",
  activeIsland: "#4A5D41",
  county: "#606C87",
  activeCounty: "#414A5D",
  water: "#8191B2",
  road: "#797B77",
};

export const areasSourceId = "islands";
export const islandsLayerId = "simpleIslandsFill";
export const countiesSourceId = "counties";
export const countiesLayerId = "simpleCounties";

export const areas: StyleSpecification = {
  version: 8,
  sources: {
    [areasSourceId]: {
      type: "geojson",
      data: areaShapes,
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: countiesLayerId,
      source: areasSourceId,
      type: "fill",
      layout: {
        visibility: "visible",
      },
      filter: ["==", ["get", "type"], "county"],
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          landColors.activeCounty,
          landColors.county,
        ],
      },
    },
    {
      id: islandsLayerId,
      source: areasSourceId,
      type: "fill",
      layout: {
        visibility: "visible",
      },
      filter: ["==", ["get", "type"], "island"],
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          landColors.activeIsland,
          landColors.island,
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

export const outlines: LayerSpecification[] = [
  {
    id: "islandOutline",
    source: areasSourceId,
    type: "line",
    filter: ["==", ["get", "type"], "island"],
    paint: {
      "line-color": landColors.activeIsland,
      "line-width": 2,
      // "line-offset": 4,
    },
  },
];
