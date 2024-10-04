import { base, satellite, usgs } from "./mapStyles";
import type { TBaseStyle, TCoreDataRelatedEndpoints } from "./types";

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
  typesense: "coredata.ecds.io",
};

export const keys = {
  typesense: "67d9b8d2810cc3a174eb949067",
  coreDataProject: 1,
};

export const mapLayers: TBaseStyle[] = [
  {
    name: "default",
    label: "Default",
    layers: base.layers.map((layer) => layer.id),
  },
  {
    name: "satellite",
    label: "Satellite",
    layers: satellite.layers.map((layer) => layer.id),
  },
  {
    name: "usgs",
    label: "USGS",
    layers: usgs.layers.map((layer) => layer.id),
  },
];

export const topBarHeight = "5rem";

export const PLACE_TYPES = {
  Airport: {
    bgColor: "red-100",
    textColor: "red-800",
  },
  Bar: {
    bgColor: "orange-100",
    textColor: "orange-800",
  },
  Basin: {
    bgColor: "amber-100",
    textColor: "amber-800",
  },
  Bay: {
    bgColor: "yellow-100",
    textColor: "yellow-800",
  },
  Beach: {
    bgColor: "lime-100",
    textColor: "lime-800",
  },
  Bend: {
    bgColor: "emerald-100",
    textColor: "emerald-800",
  },
  "Bike path": {
    bgColor: "teal-100",
    textColor: "teal-800",
  },
  Bluff: {
    bgColor: "cyan-100",
    textColor: "cyan-800",
  },
  Bridge: {
    bgColor: "sky-100",
    textColor: "sky-800",
  },
  Building: {
    bgColor: "blue-100",
    textColor: "blue-800",
  },
  Canal: {
    bgColor: "indigo-100",
    textColor: "indigo-800",
  },
  Cape: {
    bgColor: "violet-100",
    textColor: "violet-800",
  },
  Cemetery: {
    bgColor: "purple-100",
    textColor: "purple-800",
  },
  Center: {
    bgColor: "fuchsia-100",
    textColor: "fuchsia-800",
  },
  Channel: {
    bgColor: "pink-100",
    textColor: "pink-800",
  },
  Church: {
    bgColor: "rose-100",
    textColor: "rose-800",
  },
  Cliff: {
    bgColor: "red-800",
    textColor: "red-100",
  },
  Creek: {
    bgColor: "orange-800",
    textColor: "orange-100",
  },
  Cut: {
    bgColor: "yellow-800",
    textColor: "yellow-100",
  },
  Dam: {
    bgColor: "lime-800",
    textColor: "lime-100",
  },
  Dock: {
    bgColor: "emerald-800",
    textColor: "emerald-100",
  },
  Facility: {
    bgColor: "teal-800",
    textColor: "teal-100",
  },
  Field: {
    bgColor: "cyan-800",
    textColor: "cyan-100",
  },
  "Fish Farm": {
    bgColor: "sky-800",
    textColor: "sky-100",
  },
  Flats: {
    bgColor: "blue-800",
    textColor: "blue-100",
  },
  Forest: {
    bgColor: "indigo-800",
    textColor: "indigo-100",
  },
  Fort: {
    bgColor: "violet-800",
    textColor: "violet-100",
  },
  "Golf Course": {
    bgColor: "purple-800",
    textColor: "purple-100",
  },
  Government: {
    bgColor: "fuchsia-800",
    textColor: "fuchsia-100",
  },
  Hammock: {
    bgColor: "pink-800",
    textColor: "pink-100",
  },
  Harbor: {
    bgColor: "rose-800",
    textColor: "rose-100",
  },
  "Historical Site": {
    bgColor: "red-50",
    textColor: "red-700",
  },
  Hospital: {
    bgColor: "orange-50",
    textColor: "orange-700",
  },
  House: {
    bgColor: "amber-50",
    textColor: "amber-700",
  },
  Inlet: {
    bgColor: "yellow-50",
    textColor: "yellow-700",
  },
  Island: {
    bgColor: "lime-50",
    textColor: "lime-700",
  },
  Lake: {
    bgColor: "green-50",
    textColor: "green-700",
  },
  Landing: {
    bgColor: "emerald-50",
    textColor: "emerald-700",
  },
  Levee: {
    bgColor: "teal-50",
    textColor: "teal-700",
  },
  Library: {
    bgColor: "cyan-50",
    textColor: "cyan-700",
  },
  Lighthouse: {
    bgColor: "sky-50",
    textColor: "sky-700",
  },
  Marina: {
    bgColor: "blue-50",
    textColor: "blue-700",
  },
  "Nature Preserve": {
    bgColor: "indigo-50",
    textColor: "indigo-700",
  },
  Park: {
    bgColor: "violet-50",
    textColor: "violet-700",
  },
  Pasture: {
    bgColor: "purple-50",
    textColor: "purple-700",
  },
  Plantation: {
    bgColor: "fuchsia-50",
    textColor: "fuchsia-700",
  },
  "Point Bar": {
    bgColor: "pink-50",
    textColor: "pink-700",
  },
  Pond: {
    bgColor: "rose-50",
    textColor: "rose-700",
  },
  "Populated Place": {
    bgColor: "red-700",
    textColor: "red-50",
  },
  "Post Office": {
    bgColor: "orange-700",
    textColor: "orange-50",
  },
  "Rail Station": {
    bgColor: "amber-700",
    textColor: "amber-50",
  },
  Reservoir: {
    bgColor: "yellow-700",
    textColor: "yellow-50",
  },
  Ridge: {
    bgColor: "lime-700",
    textColor: "lime-50",
  },
  River: {
    bgColor: "green-700",
    textColor: "green-50",
  },
  Roadway: {
    bgColor: "emerald-700",
    textColor: "emerald-50",
  },
  Santuary: {
    bgColor: "teal-700",
    textColor: "teal-50",
  },
  School: {
    bgColor: "cyan-700",
    textColor: "cyan-50",
  },
  Shoal: {
    bgColor: "sky-700",
    textColor: "sky-50",
  },
  Sound: {
    bgColor: "blue-700",
    textColor: "blue-50",
  },
  Spit: {
    bgColor: "indigo-700",
    textColor: "indigo-50",
  },
  Spring: {
    bgColor: "red-700",
    textColor: "red-50",
  },
  Square: {
    bgColor: "violet-700",
    textColor: "violet-50",
  },
  Stream: {
    bgColor: "purple-700",
    textColor: "purple-50",
  },
  Summit: {
    bgColor: "fuchsia-700",
    textColor: "fuchsia-50",
  },
  Swamp: {
    bgColor: "pink-700",
    textColor: "pink-50",
  },
  Tower: {
    bgColor: "rose-700",
    textColor: "rose-50",
  },
  "Tree Boneyard": {
    bgColor: "red-900",
    textColor: "red-300",
  },
};
