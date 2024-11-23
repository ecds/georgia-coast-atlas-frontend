import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { TPlaceSource } from "./types";
import type { FeatureCollection } from "geojson";
import type { ESPlace } from "./esTypes";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  place: ESPlace;
  activeLayers: string[];
  setActiveLayers: Dispatch<SetStateAction<string[]>>;
  geoJSON?: FeatureCollection;
  layerSources: TPlaceSource;
  setLayerSources: Dispatch<SetStateAction<TPlaceSource>>;
  manifestLabel: "photographs" | "combined";
};

export const MapContext = createContext<TMapContext>({
  map: undefined,
  setMap: (_: SetStateAction<Map | undefined>) => {
    console.error("setMap not implemented. Did you pass it to context?");
  },
  mapLoaded: false,
  setMapLoaded: (_: SetStateAction<boolean>) => {
    console.error("setMapLoaded not implemented. Did you pass it to context?");
  },
});

export const PlaceContext = createContext<TPlaceContext>({
  place: {
    name: "",
    description: "",
    featured_photograph: "",
    featured_video: {
      featured: false,
      embed_url: "",
      provider: "",
      embed_id: "",
      name: "",
      thumbnail_url: "",
      uuid: "",
    },
    identifier: "",
    types: [],
    county: "",
    places: [],
    map_layers: [],
    topos: [],
    videos: [],
    photographs: [],
    location: { lat: 0, lon: 0 },
    uuid: "",
    slug: "",
    manifests: [],
    geojson: { type: "FeatureCollection", features: [] },
  },
  activeLayers: [],
  layerSources: {},
  manifestLabel: "photographs",
  setActiveLayers: (_: SetStateAction<string[]>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?"
    );
  },
  setLayerSources: (_: SetStateAction<TPlaceSource>) => {
    console.error(
      "setLayerSources not implemented. Did you pass it to context?"
    );
  },
});
