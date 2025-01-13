import type { StyleSpecification } from "maplibre-gl";

export const islandLayerID = "islands-fill";
export const islandSourceLayer = "island_shapes";
export const islandsStyleSource = "islands";

export const islands: StyleSpecification = {
  version: 8,
  name: "Islands",
  sources: {
    islands: {
      type: "vector",
      scheme: "tms",
      promoteId: "uuid",
      tiles: [
        `https://geoserver.ecds.emory.edu/gwc/service/tms/1.0.0/CoastalGeorgia:${islandSourceLayer}@EPSG:900913@pbf/{z}/{x}/{y}.pbf`,
      ],
      minzoom: 0,
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: islandLayerID,
      type: "fill",
      source: islandsStyleSource,
      "source-layer": islandSourceLayer,
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
      source: islandsStyleSource,
      "source-layer": islandSourceLayer,
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
