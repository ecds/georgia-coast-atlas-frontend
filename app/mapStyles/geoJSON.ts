import type { AddLayerObject } from "maplibre-gl";

export const cluster = (id: string) => {
  const layer: AddLayerObject = {
    id: `${id}-clusters`,
    type: "circle",
    source: `${id}-places`,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };
  return layer;
};

export const clusterCount = (id: string) => {
  const count: AddLayerObject = {
    id: `${id}-cluster-count`,
    type: "symbol",
    source: `${id}-places`,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };
  return count;
};

export const singlePoint = (id: string) => {
  const point: AddLayerObject = {
    id: `${id}-unclustered-point`,
    type: "symbol",
    source: `${id}-places`,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": "pulsing-dot",
    },
  };
  return point;
};
