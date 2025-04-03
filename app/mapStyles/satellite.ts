import type { StyleSpecification } from "maplibre-gl";

export const satellite: StyleSpecification = {
  version: 8,
  name: "Satellite",
  metadata: {
    "maputnik:renderer": "mbgljs",
  },
  center: [1.537786, 41.837539],
  zoom: 20,
  bearing: 0,
  pitch: 0,
  sources: {
    ortoEsri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "<b>Ortofoto resta del món</b>:Esri, DigitalGlobe, USDA, USGS, GeoEye, Getmapping, AeroGRID, IGN, IGP, UPR-EGP, and the GIS community",
      maxzoom: 18,
    },
  },
  layers: [
    {
      id: "ortoEsri",
      type: "raster",
      source: "ortoEsri",
      maxzoom: 16,
      layout: {
        visibility: "none",
      },
    },
  ],
};
