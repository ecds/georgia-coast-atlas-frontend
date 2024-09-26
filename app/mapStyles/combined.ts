import { base } from "./base"
import { labels } from "./labels";
import { satellite } from "./satellite";
import { usgs } from "./usgs"

import type { StyleSpecification } from "maplibre-gl";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
  "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",
  sources: {...base.sources, ...satellite.sources, ...usgs.sources, ...labels.sources},
  layers: [
    {
      id: "background",
      type: "background",
      maxzoom: 0,
      layout: {
        visibility: "visible",
      },
      paint: {
        "background-color": "#f8f4f0",
      },
    },
    ...base.layers,
    ...satellite.layers,
    ...usgs.layers,
    ...labels.layers]
}