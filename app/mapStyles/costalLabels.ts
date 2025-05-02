import type { FeatureCollection } from "geojson";
import type { StyleSpecification } from "maplibre-gl";

const countySeats: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Brunswick" },
      geometry: {
        type: "Point",
        coordinates: [-81.489167, 31.158889],
      },
    },
    {
      type: "Feature",
      properties: { name: "Darien" },
      geometry: {
        type: "Point",
        coordinates: [-81.430833, 31.371111],
      },
    },

    {
      type: "Feature",
      properties: { name: "Hinesville" },
      geometry: {
        type: "Point",
        coordinates: [-81.611667, 31.8325],
      },
    },

    {
      type: "Feature",
      properties: { name: "Pembroke" },
      geometry: {
        type: "Point",
        coordinates: [-81.6236, 32.14],
      },
    },
    {
      type: "Feature",
      properties: { name: "Savannah" },
      geometry: {
        type: "Point",
        coordinates: [-81.116667, 32.016667],
      },
    },

    {
      type: "Feature",
      properties: { name: "Woodbine" },
      geometry: {
        type: "Point",
        coordinates: [-81.72, 30.961944],
      },
    },
  ],
};

const haloColor = "#141B10";
const textColor = "#EDEFEB";

// const islands = [
//   "Blackbeard Island",
//   "Cumberland Island",
//   "Jekyll Island",
//   "Little Saint Simons Island",
//   "Little Tybee Island",
//   "Ossabaw Island",
//   "Saint Catherines Island",
//   "Saint Simons Island",
//   "Sapelo Island",
//   "Sea Island",
//   "Tybee Island",
//   "Wassaw Island",
//   "Wolf Island",
// ];

export const costalLabels: StyleSpecification = {
  version: 8,
  sources: {
    countySeats: {
      type: "geojson",
      data: countySeats,
    },
  },
  layers: [
    {
      id: "countySeats",
      type: "symbol",
      source: "countySeats",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Barlow, sans-serif"],
        "text-max-width": 10,
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 12, 8, 16],
      },
      paint: {
        "text-color": textColor,
        "text-halo-blur": 0,
        "text-halo-color": haloColor,
        "text-halo-width": 2,
      },
    },
    // {
    //   id: "place_label_other",
    //   type: "symbol",
    //   source: "openmaptiles",
    //   "source-layer": "place",
    //   // minzoom: 8,
    //   filter: [
    //     "all",
    //     // ["==", ["geometry-type"], "Point"],
    //     ["in", ["get", "name"], `${islands}`],
    //   ],
    //   layout: {
    //     "text-anchor": "center",
    //     "text-field": [
    //       "format",
    //       ["get", "name:latin"],
    //       "\n",
    //       {},
    //       ["get", "name:nonlatin"],
    //     ],
    //     "text-font": ["Noto Sans Regular"],
    //     "text-max-width": 6,
    //     "text-size": ["interpolate", ["linear"], ["zoom"], 6, 10, 12, 14],
    //     visibility: "visible",
    //   },
    //   paint: {
    //     "text-color": textColor,
    //     "text-halo-blur": 0,
    //     "text-halo-color": haloColor,
    //     "text-halo-width": 1,
    //   },
    // },
  ],
};
