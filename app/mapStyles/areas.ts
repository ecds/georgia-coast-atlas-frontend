import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

export const landColors = {
  island: "#68825C",
  activeIsland: "#4A5D41",
  county: "#797B77",
  activeCounty: "#565855",
  water: "#8191B2",
  road: "#C3C8C1",
  accent: "#5D414A",
};

export const areasSourceId = "CostalShapes";
export const islandsLayerId = "simpleIslandsFill";
export const countiesSourceId = "counties";
export const countiesLayerId = "simpleCounties";

export const areas: StyleSpecification = {
  version: 8,
  sources: {
    [areasSourceId]: {
      type: "vector",
      scheme: "tms",
      tiles: [
        "https://geoserver.ecds.emory.edu/gwc/service/tms/1.0.0/CoastalGeorgia:CostalShapes@EPSG:900913@pbf/{z}/{x}/{y}.pbf",
      ],
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: countiesLayerId,
      source: areasSourceId,
      "source-layer": areasSourceId,
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
        // "fill-outline-color": "white",
      },
    },
    {
      id: islandsLayerId,
      source: areasSourceId,
      "source-layer": areasSourceId,
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
    layout: { visibility: "none" },
    filter: ["==", ["get", "type"], "island"],
    paint: {
      "line-color": landColors.activeIsland,
      "line-width": 2,
      // "line-offset": 4,
    },
  },
];
