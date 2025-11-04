import type { StyleSpecification } from "maplibre-gl";

export const places: StyleSpecification = {
  version: 8,
  name: "Default",
  center: [8.54806714892635, 47.37180823552663],
  zoom: 12.241790506353492,
  bearing: 0,
  pitch: 0,
  sources: {
    places: {
      type: "vector",
      url: "https://d3j4mgzjrheeg2.cloudfront.net/places.json",
      promoteId: "uuid",
    },
  },
  layers: [
    {
      id: "gca-places",
      type: "symbol",
      source: "places",
      "source-layer": "places",
      filter: [
        "all",
        ["match", ["geometry-type"], ["MultiPoint", "Point"], true, false],
        ["!", ["in", "School", ["get", "types"]]],
      ],
      layout: {
        "text-anchor": "top",
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Italic"],
        "text-max-width": 9,
        "text-offset": [0, 0.6],
        "text-size": 12,
      },
      paint: {
        "text-color": "#fff",
        "text-halo-blur": 0.5,
        "text-halo-color": "#000",
        "text-halo-width": 0.25,
      },
    },
  ],
};
