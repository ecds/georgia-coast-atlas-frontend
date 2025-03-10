import maplibregl from "maplibre-gl";
import { base, satellite, usgs } from "./mapStyles";
import type { TBaseStyle, TTypeColors } from "./types";

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
    label: "Tybee",
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

export const dataHosts = {
  coreData: "coredata.ecdsdev.org",
  wordPress: "wp.georgiacoastatlas.org",
  typesense: "coredata.ecds.io",
  elasticSearch: "https://search.ecds.io",
};

export const keys = {
  typesense: "67d9b8d2810cc3a174eb949067",
  coreDataProject: 1,
  elasticsearch: "MEh2X0twTUIwRnd0Nl9rNEhMY2o6azRpbG8zZXlTU1dHYzJXOTNzQnMxQQ==",
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

export const PLACE_TYPES: TTypeColors = {
  Airport: {
    bgColor: "gray-100",
    textColor: "gray-800",
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
    bgColor: "green-100",
    textColor: "green-800",
  },
  Bluff: {
    bgColor: "cyan-100",
    textColor: "cyan-800",
  },
  Bridge: {
    bgColor: "gray-800",
    textColor: "gray-100",
  },
  Building: {
    bgColor: "red-600",
    textColor: "red-200",
  },
  Canal: {
    bgColor: "gray-200",
    textColor: "gray-800",
  },
  Cape: {
    bgColor: "violet-100",
    textColor: "violet-800",
  },
  Cemetery: {
    bgColor: "amber-100",
    textColor: "amber-800",
  },
  Center: {
    bgColor: "red-100",
    textColor: "red-800",
  },
  Channel: {
    bgColor: "pink-100",
    textColor: "pink-800",
  },
  Church: {
    bgColor: "blue-100",
    textColor: "blue-800",
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
    bgColor: "blue-800",
    textColor: "blue-100",
  },
  Dock: {
    bgColor: "gray-700",
    textColor: "gray-100",
  },
  Facility: {
    bgColor: "stone-300",
    textColor: "stone-800",
  },
  Field: {
    bgColor: "lime-900",
    textColor: "lime-100",
  },
  "Fish Farm": {
    bgColor: "green-800",
    textColor: "green-100",
  },
  Flats: {
    bgColor: "blue-800",
    textColor: "blue-100",
  },
  Forest: {
    bgColor: "teal-950",
    textColor: "teal-100",
  },
  Fort: {
    bgColor: "rose-200",
    textColor: "rose-800",
  },
  "Golf Course": {
    bgColor: "lime-800",
    textColor: "lime-100",
  },
  Government: {
    bgColor: "sky-800",
    textColor: "sky-100",
  },
  Hammock: {
    bgColor: "pink-800",
    textColor: "pink-100",
  },
  Harbor: {
    bgColor: "gray-800",
    textColor: "gray-100",
  },
  "Historical Site": {
    bgColor: "orange-900",
    textColor: "orange-100",
  },
  Hospital: {
    bgColor: "cyan-800",
    textColor: "cyan-100",
  },
  House: {
    bgColor: "amber-200",
    textColor: "amber-700",
  },
  Inlet: {
    bgColor: "yellow-200",
    textColor: "yellow-700",
  },
  Island: {
    bgColor: "lime-200",
    textColor: "lime-700",
  },
  Lake: {
    bgColor: "green-200",
    textColor: "green-700",
  },
  Landing: {
    bgColor: "emerald-200",
    textColor: "emerald-700",
  },
  Levee: {
    bgColor: "teal-200",
    textColor: "teal-700",
  },
  Library: {
    bgColor: "blue-100",
    textColor: "cyan-700",
  },
  Lighthouse: {
    bgColor: "sky-200",
    textColor: "sky-700",
  },
  Marina: {
    bgColor: "blue-200",
    textColor: "blue-700",
  },
  "Nature Preserve": {
    bgColor: "indigo-200",
    textColor: "indigo-700",
  },
  Park: {
    bgColor: "teal-600",
    textColor: "teal-100",
  },
  Pasture: {
    bgColor: "emerald-900",
    textColor: "emerald-100",
  },
  Plantation: {
    bgColor: "fuchsia-200",
    textColor: "fuchsia-700",
  },
  "Point Bar": {
    bgColor: "pink-200",
    textColor: "pink-700",
  },
  Pond: {
    bgColor: "rose-200",
    textColor: "rose-700",
  },
  "Populated Place": {
    bgColor: "slate-800",
    textColor: "slate-200",
  },
  "Post Office": {
    bgColor: "orange-700",
    textColor: "orange-200",
  },
  "Rail Station": {
    bgColor: "purple-700",
    textColor: "purple-200",
  },
  Reservoir: {
    bgColor: "yellow-700",
    textColor: "yellow-200",
  },
  Ridge: {
    bgColor: "lime-700",
    textColor: "lime-200",
  },
  River: {
    bgColor: "green-700",
    textColor: "green-200",
  },
  Roadway: {
    bgColor: "emerald-700",
    textColor: "emerald-200",
  },
  Santuary: {
    bgColor: "teal-700",
    textColor: "teal-200",
  },
  School: {
    bgColor: "blue-400",
    textColor: "blue-950",
  },
  Shoal: {
    bgColor: "sky-700",
    textColor: "sky-200",
  },
  Sound: {
    bgColor: "blue-700",
    textColor: "blue-200",
  },
  Spit: {
    bgColor: "indigo-700",
    textColor: "indigo-200",
  },
  Spring: {
    bgColor: "red-700",
    textColor: "red-200",
  },
  Square: {
    bgColor: "green-900",
    textColor: "green-200",
  },
  Stream: {
    bgColor: "purple-700",
    textColor: "purple-200",
  },
  Summit: {
    bgColor: "fuchsia-700",
    textColor: "fuchsia-200",
  },
  Swamp: {
    bgColor: "lime-950",
    textColor: "lime-200",
  },
  Tower: {
    bgColor: "rose-700",
    textColor: "rose-200",
  },
  Tree: {
    bgColor: "teal-950",
    textColor: "teal-100",
  },
  "Tree Boneyard": {
    bgColor: "red-900",
    textColor: "red-300",
  },
};

export const indexCollection = "georgia_coast_places";
export const countyIndexCollection = "georgia_coast_counties";
export const topicIndexCollection = "georgia_coast_topics";
export const mapIndexCollection = "georgia_coast_maps";
export const panosIndexCollection = "georgia_coast_panos";
export const worksIndexCollection = "georgia_coast_works";
export const mapIndexCollection = "georgia_coast_maps";
export const worksIndexCollection = "georgia_coast_works";

export const defaultBounds = () => {
  return new maplibregl.LngLatBounds(
    new maplibregl.LngLat(-81.93612670899995, 30.71087651700003),
    new maplibregl.LngLat(-80.85723315099995, 32.241012160000025)
  );
};
