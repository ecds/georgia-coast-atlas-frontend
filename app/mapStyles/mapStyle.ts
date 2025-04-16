import { base, water } from "./base";
import { costalLabels } from "./costalLabels";
import { areas, outlines } from "./areas";
import { satellite } from "./satellite";
import { usgs } from "./usgs";

import type { StyleSpecification } from "maplibre-gl";
import { masks } from "./masks";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",

  sources: {
    ...areas.sources,
    ...base.sources,
    ...satellite.sources,
    ...usgs.sources,
    ...costalLabels.sources,
    ...masks.sources,
  },
  layers: [
    {
      id: "background",
      type: "background",
      maxzoom: 0,
      layout: {
        visibility: "visible",
      },
      paint: {
        "background-color": "#9DA19C",
      },
    },
    ...areas.layers,
    ...base.layers,
    ...outlines,
    ...masks.layers,
    ...water,
    ...satellite.layers,
    ...usgs.layers,
    // ...labels.layers,
    ...costalLabels.layers,
  ],
};
