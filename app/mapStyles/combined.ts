import { base } from "./base";
import { counties } from "./counties";
import { islands } from "./islands";
import { labels } from "./labels";
import { satellite } from "./satellite";
import { usgs } from "./usgs";

import type { StyleSpecification } from "maplibre-gl";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",
  sources: {
    ...base.sources,
    ...satellite.sources,
    ...usgs.sources,
    ...labels.sources,
    ...islands.sources,
    ...counties.sources,
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
        "background-color": "rgb(123 162 141)",
      },
    },
    ...base.layers,
    ...satellite.layers,
    ...usgs.layers,
    ...islands.layers,
    ...counties.layers,
    ...labels.layers,
  ],
};
