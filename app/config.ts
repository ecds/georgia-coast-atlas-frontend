import type { TCoreDataRelatedEndpoints } from "./types";

export const islands = [
  {
    id: "blackbeard",
    label: "Blackbeard",
    coreDataId: "c4e43063-179b-5807-a191-6e1438170486",
  },
  {
    id: "cumberland",
    label: "Cumberland",
    coreDataId: "ab536bff-55c5-50d5-b06f-2be190dd88a4",
  },
  {
    id: "jekyll",
    label: "Jekyll",
    coreDataId: "aa8a4b3b-febb-52fd-acaf-7e5f73ba1426",
  },
  {
    id: "little-saint-simons",
    label: "Little Saint Simons",
    coreDataId: "e0a98bec-543b-47c7-a00b-b3f509dde77f",
  },
  {
    id: "ossabaw",
    label: "Ossabaw",
    coreDataId: "79b2c613-a9f7-4e1e-b795-0faeed53c827",
  },
  {
    id: "sapelo",
    label: "Sapelo",
    coreDataId: "75fc9ef3-7a0b-4856-83dd-ea8c574eef5f",
  },
  {
    id: "saint-catherines",
    label: "Saint. Catherine's",
    coreDataId: "643bf294-badc-486b-8644-84209c49735b",
  },
  {
    id: "saint-simons",
    label: "Saint Simons",
    coreDataId: "8c113813-f475-42b9-bcfa-4915d24009a9",
  },
  {
    id: "tybee",
    label: "Tybee Island",
    coreDataId: "532b46db-0bf7-486b-b055-3b852ee6d21f",
  },
  {
    id: "wassaw",
    label: "Wassaw",
    coreDataId: "46c9700b-2dfa-4aed-81e6-50d81c168401",
  },
  {
    id: "wolf",
    label: "Wolf",
    coreDataId: "dcec5413-40a6-418a-b5f5-db04e183cf96",
  },
];

export const modelFieldUUIDs = {
  county: "005cba1d-1d0e-4ab0-855d-57884d9db2b0",
  description: "159c8717-703e-40c5-a813-425578f9a8a7",
  identifier: "378d2b43-dcc0-4b64-8ef9-ecd7d743e2fb",
  kml: "dec90162-73fd-4a02-8079-a215c9a8300b",
  photographs: "0fbeaac4-45a3-4767-b9bc-7674632a8be1",
  relatedPlaces: "2a9bcd0d-36a1-4c1a-b9af-55db56c243e1",
  topo: "2eaaf83f-98f0-4402-b3bc-92b185fcbaa4",
  types: "dc00ae2f-e12f-4bc8-934e-97bad18e5237",
  videos: "d23eb32a-4157-48f9-bfe8-fc981600a4f8",
  topoQuads: "87ad2c7a-cf8f-4be7-af0c-4e63baab6eb3",
  mapLayers: "84c15c15-39ec-4574-b32f-b70fb00ab69c",
};

export const coreDataRelatedEndpoints: TCoreDataRelatedEndpoints[] = [
  {
    endpoint: "media_contents",
    uiLabel: "Related Media & Documents",
    types: [
      {
        uuid: modelFieldUUIDs.photographs,
        type: "photographs",
        uiLabel: "Photographs",
      },
    ],
  },
  {
    endpoint: "places",
    uiLabel: "Related Places",
    types: [
      {
        uuid: modelFieldUUIDs.county,
        type: "county",
        uiLabel: "County",
      },
      {
        uuid: modelFieldUUIDs.relatedPlaces,
        type: "relatedPlaces",
        uiLabel: "Related Places",
      },
      {
        uuid: modelFieldUUIDs.topoQuads,
        type: "topoQuads",
        uiLabel: "Topo Quad",
      },
      {
        uuid: modelFieldUUIDs.mapLayers,
        type: "mapLayers",
        uiLabel: "Maps",
      },
    ],
  },
  {
    endpoint: "taxonomies",
    uiLabel: "Taxonomies",
    types: [
      {
        uuid: modelFieldUUIDs.types,
        type: "type",
        uiLabel: "Type",
      },
    ],
  },
  {
    endpoint: "items",
    uiLabel: "Items",
    types: [
      {
        uuid: modelFieldUUIDs.topo,
        type: "topo",
        uiLabel: "Topo",
      },
      {
        uuid: modelFieldUUIDs.videos,
        type: "videos",
        uiLabel: "Videos",
      },
    ],
  },
];

export const dataHosts = {
  coreData: "coredata.ecdsdev.org",
  wordPress: "wp.georgiacoastatlas.org",
};

export const keys = {
  typesense: "67d9b8d2810cc3a174eb949067",
  coreDataProject: 1,
};

export const mapLayers = [
  {
    id: "google-satellite",
    label: "Google Satellite",
    tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
    attribution: "© Google",
  },
  {
    id: "usgs-topo",
    label: "USGS Topo",
    tiles: [
      "https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=0&styles=default",
    ],
    attribution: "© USGS",
  },
  {
    id: "atlmaps",
    label: "ATLMaps",
    tiles: [
      "https://geoserver.ecds.emory.edu/ATLMaps/gwc/service/wms?layers=ATLMaps:r9jps&service=WMS&request=GetMap&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}",
    ],
    attribution: "© ATLMaps",
  },
];

export const topBarHeight = "5rem";
