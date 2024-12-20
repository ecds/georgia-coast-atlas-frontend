import { simpleIslandShapes } from "./sources";
import type { StyleSpecification } from "maplibre-gl";

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
        "fill-opacity": 1,
        "fill-color": "#8191B2",
      },
    },
  ],
};
