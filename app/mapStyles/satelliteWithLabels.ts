import { satellite } from "./satellite";
import { labels } from "./labels";

import type { StyleSpecification } from "maplibre-gl";

export const satelliteWithLabels: StyleSpecification = {
  version: 8,
  name: "Satellite",
  metadata: {
    id: "default",
    "mapbox:type": "template",
    "maputnik:renderer": "mbgljs",
  },
  center: [8.54806714892635, 47.37180823552663],
  zoom: 12.241790506353492,
  bearing: 0,
  pitch: 0,
  sources: { ...satellite.sources, ...labels.sources },
  glyphs: labels.glyphs,
  layers: [...satellite.layers, ...labels.layers],
};
