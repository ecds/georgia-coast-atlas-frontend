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
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          "#4A5D41",
          "#68825C",
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
        visibility: "visible",
      },
      paint: {
        "line-color": "#8191B2",
        "line-width": 1,
        "line-opacity": 1,
      },
    },
  ],
};
