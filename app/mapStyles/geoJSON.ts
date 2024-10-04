import type { AddLayerObject } from "maplibre-gl";

export const cluster = (id: string) => {
  console.log("🚀 ~ cluster ~ id:", id);
  const layer: AddLayerObject = {
    id: `${id}-clusters`,
    type: "circle",
    source: `${id}-places`,
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["number", ["get", "point_count"], 1],
        0,
        4,
        10,
        14,
      ],
      "circle-stroke-width": 1,
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#3b62ff",
        "#ff623b",
      ],
      "circle-stroke-color": "#8d260c",
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
      "text-font": ["Noto Sans Regular"],
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
