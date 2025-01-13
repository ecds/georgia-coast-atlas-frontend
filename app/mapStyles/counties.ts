import type { StyleSpecification } from "maplibre-gl";

export const countiesSourceLayer = "simplified_inland_counties";
export const countiesStyleSource = "counties";
export const countyLayerID = "simpleCounties";

export const counties: StyleSpecification = {
  version: 8,
  sources: {
    [countiesStyleSource]: {
      type: "vector",
      scheme: "tms",
      promoteId: "uuid",
      tiles: [
        `https://geoserver.ecds.emory.edu/gwc/service/tms/1.0.0/CoastalGeorgia:${countiesSourceLayer}@EPSG:900913@pbf/{z}/{x}/{y}.pbf`,
      ],
      minzoom: 0,
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: countyLayerID,
      source: countiesStyleSource,
      "source-layer": countiesSourceLayer,
      type: "fill",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hovered"], false],
          "#606C87",
          "#414A5D",
        ],
      },
    },
  ],
};
