import type { StyleSpecification } from "maplibre-gl";

export const islands: StyleSpecification = {
  version: 8,
  name: "Islands",
  sources: {
    islands: {
      type: "geojson",
      data: "/geojson/islands",
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "islands-fill",
      type: "fill",
      source: "islands",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": "#2563eb",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          0.65,
          0.25,
        ],
      },
    },
    {
      id: "islands-outline",
      type: "line",
      source: "islands",
      layout: {
        "line-join": "round",
        "line-cap": "round",
        visibility: "none",
      },
      paint: {
        "line-color": "#2563eb",
        "line-width": 1,
        "line-opacity": 0.5,
      },
    },
  ],
};
