import type { StyleSpecification } from "maplibre-gl";

export const water: StyleSpecification = {
  version: 8,
  name: "Water and Roads",
  center: [8.54806714892635, 47.37180823552663],
  zoom: 12.241790506353492,
  bearing: 0,
  pitch: 0,
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
      attribution:
        '<a href="https://ecds.emory.edu" target="_blank">Emory Center for Digital Scholarship</a> | <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    },
  },
  layers: [
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: [
        "all",
        ["==", ["geometry-type"], "Polygon"],
        ["!=", ["get", "brunnel"], "tunnel"],
        ["!=", ["get", "class"], "swimming_pool"],
      ],
      paint: { "fill-color": "#8191B2" },
    },
    {
      id: "waterway-tunnel",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: [
        "all",
        ["==", ["geometry-type"], "LineString"],
        ["==", ["get", "brunnel"], "tunnel"],
      ],
      paint: {
        "line-color": "#8191B2",
        "line-dasharray": [3, 3],
        "line-gap-width": ["interpolate", ["linear"], ["zoom"], 12, 0, 20, 6],
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          8,
          1,
          20,
          2,
        ],
      },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: [
        "all",
        ["==", ["geometry-type"], "LineString"],
        ["match", ["get", "brunnel"], ["bridge", "tunnel"], false, true],
      ],
      paint: {
        "line-color": "#8191B2",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          8,
          1,
          20,
          8,
        ],
      },
    },
  ],
};
