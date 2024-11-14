import type { StyleSpecification } from "maplibre-gl";

export const counties: StyleSpecification = {
  version: 8,
  name: "County",
  sources: {
    counties: {
      type: "geojson",
      data: "/geojson/counties",
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "counties-fill",
      type: "fill",
      source: "counties",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": "#ea580c",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          0.65,
          0.25,
        ],
      },
    },
    {
      id: "counties-outline",
      type: "line",
      source: "counties",
      layout: {
        "line-join": "round",
        "line-cap": "round",
        visibility: "none",
      },
      paint: {
        "line-color": "#ea580c",
        "line-width": 1,
        "line-opacity": 0.25,
      },
    },
  ],
};
