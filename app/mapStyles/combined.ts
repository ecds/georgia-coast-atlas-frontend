import { base } from "./base";
import { costalLabels } from "./costalLabels";
import { masks } from "./masks";
import { satellite } from "./satellite";
import { usgs } from "./usgs";

import type { StyleSpecification } from "maplibre-gl";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",

  sources: {
    ...masks.sources,
    ...base.sources,
    ...satellite.sources,
    ...usgs.sources,
    ...costalLabels.sources,
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
    ...masks.layers,
    ...base.layers,
    ...satellite.layers,
    ...usgs.layers,
    // ...labels.layers,
    ...costalLabels.layers,
  ],
};
