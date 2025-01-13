import { roads } from "./roads";
import { water } from "./water";
import { costalLabels } from "./costalLabels";
import { islands } from "./islands";
import { satellite } from "./satellite";
import { usgs } from "./usgs";

import type { StyleSpecification } from "maplibre-gl";
import { counties } from "./counties";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",

  sources: {
    ...counties.sources,
    ...islands.sources,
    ...water.sources,
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
    ...counties.layers,
    ...islands.layers,
    ...water.layers,
    ...roads.layers,
    ...satellite.layers,
    ...usgs.layers,
    ...costalLabels.layers,
  ],
};
