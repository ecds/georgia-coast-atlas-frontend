import { base, water } from "./base";
import { costalLabels } from "./costalLabels";
import { areas } from "./areas";
import { satellite } from "./satellite";
import { usgs } from "./usgs";
import type { StyleSpecification } from "maplibre-gl";
import { osm } from "./osm";

export const combined: StyleSpecification = {
  version: 8,
  name: "Combined",
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",

  sources: {
    terrain: {
      type: "raster-dem",
      url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=uXfXuebPlkoPXiY3TPcv`,
    },
    ...areas.sources,
    ...base.sources,
    ...satellite.sources,
    ...usgs.sources,
    ...costalLabels.sources,
    ...osm.sources,
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
        "background-color": "#C3C8C1",
      },
    },

    ...areas.layers,
    {
      id: "hillshading",
      source: "terrain",
      type: "hillshade",
    },
    ...base.layers,
    ...water,
    ...satellite.layers,
    ...usgs.layers,
    // ...labels.layers,
    ...costalLabels.layers,
    ...osm.layers,
  ],
};
