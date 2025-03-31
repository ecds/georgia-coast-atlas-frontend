import type { AddLayerObject } from "maplibre-gl";

type ClusterOptions = {
  id: string;
  source: string;
  fillColor?: string;
  textColor?: string;
};

export const cluster = ({ id, source, fillColor = "blue" }: ClusterOptions) => {
  const layer: AddLayerObject = {
    id,
    type: "circle",
    source,
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      "circle-stroke-width": 1,
      "circle-color": fillColor,
      "circle-stroke-color": "lightgray",
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.75,
      ],
    },
  };
  return layer;
};

export const largeCluster = ({ id, source, fillColor }: ClusterOptions) => {
  const layer: AddLayerObject = {
    id,
    type: "circle",
    source,
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["number", ["get", "point_count"], 1],
        0,
        8,
        12,
        16,
      ],
      "circle-stroke-width": 1,
      "circle-color": fillColor ?? "#1d4ed8",
      "circle-stroke-color": "lightgray",
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.75,
      ],
    },
  };
  return layer;
};

export const clusterCount = ({ id, source, textColor }: ClusterOptions) => {
  const count: AddLayerObject = {
    id,
    type: "symbol",
    source,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": textColor ?? "white",
    },
  };
  return count;
};

export const singlePoint = (id: string, source: string, size?: number) => {
  const point: AddLayerObject = {
    id,
    type: "circle",
    source,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": size ?? 6,
      "circle-color": ["string", ["get", "hexColor"]],
      "circle-stroke-color": "gray",
      "circle-stroke-width": 2,
    },
  };
  return point;
};

export const placePolygon = (
  id: string,
  source: string,
  fillColor?: string
) => {
  console.log("🚀 ~ source:", source);
  const polygon: AddLayerObject = {
    id,
    type: "fill",
    source,
    paint: {
      "fill-color": fillColor ?? "orange",
      "fill-opacity": 1,
    },
  };
  return polygon;
};
