import type { StyleSpecification } from "maplibre-gl";

export const labels: StyleSpecification = {
  version: 8,
  name: "Labels",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=uXfXuebPlkoPXiY3TPcv",
    },
    contours: {
      type: "vector",
      url: "https://api.maptiler.com/tiles/contours/tiles.json?key=uXfXuebPlkoPXiY3TPcv",
    },
  },
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",
  layers: [
    {
      id: "contour_label",
      type: "symbol",
      metadata: {},
      source: "contours",
      "source-layer": "contour",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["in", "nth_line", 10, 5],
        [">", "height", 0],
      ],
      layout: {
        "symbol-avoid-edges": true,
        "symbol-placement": "line",
        "text-allow-overlap": false,
        "text-field": "{height} m",
        "text-font": ["Noto Sans Regular"],
        "text-ignore-placement": false,
        "text-padding": 10,
        "text-rotation-alignment": "map",
        "text-size": {
          base: 1,
          stops: [
            [15, 9.5],
            [20, 12],
          ],
        },
      },
      paint: {
        "text-color": "hsl(0, 0%, 37%)",
        "text-halo-color": "hsla(0, 0%, 100%, 0.5)",
        "text-halo-width": 1.5,
      },
    },
    {
      id: "housenumber",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "housenumber",
      minzoom: 17,
      filter: ["==", "$type", "Point"],
      layout: {
        "text-field": "{housenumber}",
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
      },
      paint: {
        "text-color": "hsla(0, 14%, 57%, 0.51)",
        "text-halo-color": "hsl(39, 41%, 86%)",
        "text-halo-width": 0.5,
      },
    },
    {
      id: "poi_label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "poi",
      minzoom: 14,
      filter: ["all", ["==", "$type", "Point"], ["==", "rank", 1]],
      layout: {
        "icon-size": 1,
        "text-anchor": "top",
        "text-field": "{name:latin}\n{name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 8,
        "text-offset": [0, 0.5],
        "text-size": 11,
        visibility: "visible",
      },
      paint: {
        "text-color": "#666",
        "text-halo-blur": 1,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 1,
      },
    },
    {
      id: "airport-label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "aerodrome_label",
      minzoom: 10,
      filter: ["all", ["has", "iata"]],
      layout: {
        "icon-size": 1,
        "text-anchor": "top",
        "text-field": "{name:latin}\n{name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 8,
        "text-offset": [0, 0.5],
        "text-size": 11,
        visibility: "visible",
      },
      paint: {
        "text-color": "#666",
        "text-halo-blur": 1,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 1,
      },
    },
    {
      id: "road_major_label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      filter: ["==", "$type", "LineString"],
      layout: {
        "symbol-placement": "line",
        "text-field": "{name:latin} {name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-letter-spacing": 0.1,
        "text-rotation-alignment": "map",
        "text-size": {
          base: 1.4,
          stops: [
            [10, 8],
            [20, 14],
          ],
        },
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "#000",
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 2,
      },
    },
    {
      id: "mountain_peak",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "mountain_peak",
      minzoom: 7,
      filter: ["all", ["==", "$type", "Point"], ["==", "rank", 1]],
      layout: {
        "icon-size": 1,
        "text-anchor": "bottom",
        "text-field": "{name:latin} {name:nonlatin}\n{ele} m\n▲",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 8,
        "text-offset": [0, 0.5],
        "text-size": 11,
        visibility: "visible",
      },
      paint: {
        "text-color": "rgba(51, 51, 51, 1)",
        "text-halo-blur": 1,
        "text-halo-color": "rgba(255,255,255,1)",
        "text-halo-width": 1,
      },
    },
    {
      id: "park-label",
      type: "symbol",
      metadata: {
        "mapbox:group": "1444849242106.713",
      },
      source: "openmaptiles",
      "source-layer": "park",
      minzoom: 0,
      filter: ["all", ["==", "rank", 1], ["==", "$type", "Point"]],
      layout: {
        "text-allow-overlap": false,
        "text-field": "{name:latin}\n{name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-ignore-placement": false,
        "text-letter-spacing": 0.1,
        "text-max-width": 9,
        "text-size": {
          base: 1.2,
          stops: [
            [12, 10],
            [15, 14],
          ],
        },
        "text-transform": "none",
        visibility: "visible",
      },
      paint: {
        "text-color": "rgba(38, 92, 46, 1)",
        "text-halo-color": "rgba(255,255,255,0.8)",
        "text-halo-width": 1.2,
      },
    },
    {
      id: "place_label_other",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 8,
      filter: [
        "all",
        ["==", "$type", "Point"],
        ["all", ["!in", "class", "city", "state", "country", "continent"]],
      ],
      layout: {
        "text-anchor": "center",
        "text-field": "{name:latin}\n{name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 6,
        "text-size": {
          stops: [
            [6, 10],
            [12, 14],
          ],
        },
        visibility: "visible",
      },
      paint: {
        "text-color": "hsl(0, 10%, 25%)",
        "text-halo-blur": 0,
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 2,
      },
    },
    {
      id: "place_label_city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      maxzoom: 16,
      filter: ["all", ["==", "$type", "Point"], ["==", "class", "city"]],
      layout: {
        "text-field": "{name:latin}\n{name:nonlatin}",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 10,
        "text-size": {
          stops: [
            [3, 12],
            [8, 16],
          ],
        },
      },
      paint: {
        "text-color": "hsl(0, 0%, 0%)",
        "text-halo-blur": 0,
        "text-halo-color": "hsla(0, 0%, 100%, 0.75)",
        "text-halo-width": 2,
      },
    },
    {
      id: "country_label-other",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      maxzoom: 12,
      filter: [
        "all",
        ["==", "$type", "Point"],
        ["==", "class", "country"],
        ["!has", "iso_a2"],
      ],
      layout: {
        "text-field": "{name:latin}",
        "text-font": ["Noto Sans Regular"],
        "text-max-width": 10,
        "text-size": {
          stops: [
            [3, 12],
            [8, 22],
          ],
        },
        visibility: "visible",
      },
      paint: {
        "text-color": "hsl(0, 0%, 13%)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 2,
      },
    },
    {
      id: "country_label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      maxzoom: 12,
      filter: [
        "all",
        ["==", "$type", "Point"],
        ["==", "class", "country"],
        ["has", "iso_a2"],
      ],
      layout: {
        "text-field": "{name:latin}",
        "text-font": ["Noto Sans Bold"],
        "text-max-width": 10,
        "text-size": {
          stops: [
            [3, 12],
            [8, 22],
          ],
        },
      },
      paint: {
        "text-color": "hsl(0, 0%, 13%)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 2,
      },
    },
  ],
};
