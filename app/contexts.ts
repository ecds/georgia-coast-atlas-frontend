import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { ESPlace } from "./esTypes";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  place: ESPlace;
  activeLayers?: string[];
  setActiveLayers?: Dispatch<SetStateAction<string[]>>;
  full?: boolean;
  relatedClosed?: boolean;
  clusterFillColor?: string;
  clusterTextColor?: string;
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
    bbox: [0, 0, 0, 0],
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
    short_description: "",
    manifests: [],
    geojson: { type: "FeatureCollection", features: [] },
  },
  activeLayers: [],
  setActiveLayers: (_: SetStateAction<string[]>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?"
    );
  },
});

type TSearchContext = {
  activeResult: string | undefined;
  setActiveResult: Dispatch<SetStateAction<string | undefined>>;
};

export const SearchContext = createContext<TSearchContext>({
  activeResult: undefined,
  setActiveResult: (_: SetStateAction<string | undefined>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?"
    );
  },
});
