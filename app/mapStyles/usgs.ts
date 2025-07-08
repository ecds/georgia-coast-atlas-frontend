import { labels } from "./labels";
import type { StyleSpecification } from "maplibre-gl";

export const usgs: StyleSpecification = {
  version: 8,
  name: "USGS",
  metadata: {
    id: "usgs",
    "maputnik:renderer": "mbgljs",
  },
  center: [1.537786, 41.837539],
  zoom: 12,
  bearing: 0,
  pitch: 0,
  sources: {
    usgsImageryTopo: {
      type: "raster",
      tiles: [
        "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "USGS The National Map: Orthoimagery and US Topo. Data refreshed August, 2024.",
      maxzoom: 20,
    },
  },
  glyphs: labels.glyphs,
  layers: [
    {
      id: "usgsImageryTopo",
      type: "raster",
      source: "usgsImageryTopo",
      maxzoom: 20,
      layout: {
        visibility: "none",
      },
    },
  ],
};
