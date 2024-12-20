import maplibregl from "maplibre-gl";
import { water, satellite, usgs } from "./mapStyles";
import type { TBaseStyle, TTypeColors } from "./types";

export const ISLAND_ROUTES = [
  "blackbeard-island",
  "cumberland-island",
  "jekyll-island",
  "little-saint-simons-island",
  "ossabaw-island",
  "sapelo-island",
  "saint-catherines-island",
  "saint-simons-island",
  "tybee-island",
  "wassaw-island",
  "wolf-island",
];

export const dataHosts = {
  coreData: "coredata.ecdsdev.org",
  wordPress: "wp.georgiacoastatlas.org",
  elasticSearch: "https://search.ecds.io",
};

export const keys = {
  elasticsearch: "MEh2X0twTUIwRnd0Nl9rNEhMY2o6azRpbG8zZXlTU1dHYzJXOTNzQnMxQQ==",
};

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
    textColor: "red-50",
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
    bgColor: "blue-100",
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
    bgColor: "teal-600",
    textColor: "teal-100",
  },
  Pasture: {
    bgColor: "emerald-900",
    textColor: "emerald-100",
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
    bgColor: "slate-800",
    textColor: "slate-50",
  },
  "Post Office": {
    bgColor: "orange-700",
    textColor: "orange-50",
  },
  "Rail Station": {
    bgColor: "purple-700",
    textColor: "purple-50",
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
    bgColor: "blue-400",
    textColor: "blue-950",
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
    bgColor: "green-900",
    textColor: "green-50",
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
    bgColor: "lime-950",
    textColor: "lime-50",
  },
  Tower: {
    bgColor: "rose-700",
    textColor: "rose-50",
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

export const defaultBounds = () => {
  return new maplibregl.LngLatBounds(
    new maplibregl.LngLat(-81.93612670899995, 30.71087651700003),
    new maplibregl.LngLat(-80.85723315099995, 32.241012160000025)
  );
};

export const islandLayerID = "islands-fill";
export const countyLayerID = "simpleCounties";

export const mapLayers: TBaseStyle[] = [
  {
    name: "default",
    label: "Default",
    layers: water.layers.map((layer) => layer.id),
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
