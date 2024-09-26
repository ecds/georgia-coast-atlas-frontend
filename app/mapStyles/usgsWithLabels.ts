import { usgs } from "./usgs";
import { labels } from "./labels";

import type { StyleSpecification } from "maplibre-gl";

export const usgsWithLabels: StyleSpecification = {
  version: 8,
  name: "USGS",
  metadata: {
    id: "USGS",
    "mapbox:type": "template",
    "maputnik:renderer": "mbgljs",
  },
  center: [8.54806714892635, 47.37180823552663],
  zoom: 12.241790506353492,
  bearing: 0,
  pitch: 0,
  sources: { ...usgs.sources, ...labels.sources },
  glyphs: labels.glyphs,
  layers: [...usgs.layers, ...labels.layers],
};
