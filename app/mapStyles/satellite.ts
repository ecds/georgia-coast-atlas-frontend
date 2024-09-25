import type { StyleSpecification } from "maplibre-gl";

export const satellite: StyleSpecification = {
  version: 8,
  name: "Satellite",
  metadata: {
    "maputnik:renderer": "mbgljs",
  },
  center: [1.537786, 41.837539],
  zoom: 12,
  bearing: 0,
  pitch: 0,
  sources: {
    ortoICGC: {
      type: "raster",
      tiles: [
        "https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '<b>Ortofoto Catalunya</b>:<a href="https://www.icgc.cat/Aplicacions/Visors/ContextMaps">Institut Cartogràfic i Geològic de Catalunya</a> |',
      maxzoom: 20,
    },
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
    terrainICGCR: {
      type: "raster",
      tiles: [
        "https://geoserveis.icgc.cat/servei/catalunya/contextmaps-terreny-5m-rgb/wmts/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      bounds: [0, 40.5, 4.2, 42.86],
      minzoom: 7,
      maxzoom: 14,
    },
    contextmapsslope: {
      type: "raster",
      tiles: [
        "https://geoserveis.icgc.cat/servei/catalunya/contextmaps-slope/wmts/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 16,
    },
  },
  glyphs:
    "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=uXfXuebPlkoPXiY3TPcv",
  layers: [
    {
      id: "background",
      type: "background",
      maxzoom: 0,
      layout: {
        visibility: "visible",
      },
      paint: {
        "background-color": "#f8f4f0",
      },
    },
    {
      id: "ortoICGC",
      type: "raster",
      source: "ortoICGC",
      maxzoom: 19,
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "ortoEsri",
      type: "raster",
      source: "ortoEsri",
      maxzoom: 16,
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "DEM",
      type: "raster",
      source: "terrainICGCR",
      maxzoom: 19,
      filter: ["any"],
      layout: {
        visibility: "none",
      },
      paint: {
        "raster-resampling": "nearest",
        "raster-contrast": 0,
        "raster-fade-duration": 300,
        "raster-saturation": 0.1,
        "raster-brightness-min": 0,
        "raster-opacity": 0.1,
        "raster-brightness-max": 0,
      },
    },
    {
      id: "slope",
      type: "raster",
      source: "contextmapsslope",
      maxzoom: 12,
      layout: {
        visibility: "none",
      },
    },
  ],
};
