import { base } from "./base";
import { labels } from "./labels";
import { satellite } from "./satellite";
import { usgs } from "./usgs";

import type { StyleSpecification } from "maplibre-gl";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs: "https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf",
  sources: {
    ...base.sources,
    ...satellite.sources,
    ...usgs.sources,
    ...labels.sources,
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
    ...labels.layers,
  ],
};
