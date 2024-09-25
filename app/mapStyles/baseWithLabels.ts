import { base } from "./base";
import { labels } from "./labels";

import type { StyleSpecification } from "maplibre-gl";

export const baseWithLabels: StyleSpecification = {
  version: 8,
  name: "Default",
  metadata: {
    id: "default",
    "mapbox:type": "template",
    "maputnik:renderer": "mbgljs",
  },
  center: [8.54806714892635, 47.37180823552663],
  zoom: 12.241790506353492,
  bearing: 0,
  pitch: 0,
  sources: { ...base.sources, ...labels.sources },
  glyphs: labels.glyphs,
  layers: [...base.layers, ...labels.layers],
};
