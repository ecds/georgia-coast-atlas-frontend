import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { ESPlace, ESRelatedPlace } from "./esTypes";
import type { TIIIFBody } from "./types";

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
  activePlace: ESRelatedPlace | undefined;
  setActivePlace: Dispatch<SetStateAction<ESRelatedPlace | undefined>>;
  hoveredPlace: ESRelatedPlace | undefined;
  setHoveredPlace: Dispatch<SetStateAction<ESRelatedPlace | undefined>>;
  noTrackMouse?: boolean;
  setNoTrackMouse?: Dispatch<SetStateAction<boolean>>;
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
    county: "",
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
    geojson: { type: "FeatureCollection", features: [] },
    identifier: "",
    location: { lat: 0, lon: 0 },
    manifests: [],
    map_layers: [],
    name: "",
    photographs: [],
    places: [],
    short_description: "",
    slug: "",
    topos: [],
    types: [],
    type: "",
    videos: [],
    uuid: "",
  },
  activeLayers: [],
  setActiveLayers: (_: SetStateAction<string[]>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?"
    );
  },
  activePlace: undefined,
  setActivePlace: (_: SetStateAction<ESRelatedPlace | undefined>) => {
    console.error(
      "setActivePlace not implemented. Did you pass it to context?"
    );
  },
  hoveredPlace: undefined,
  setHoveredPlace: (_: SetStateAction<ESRelatedPlace | undefined>) => {
    console.error(
      "setActiveHovered not implemented. Did you pass it to context?"
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

type TSearchModalContext = {
  searchModalOpen: boolean;
  setSearchModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const SearchModalContext = createContext<TSearchModalContext>({
  searchModalOpen: true, // Default to open
  setSearchModalOpen: (_: SetStateAction<boolean>) => {
    console.error(
      "setSearchModalOpen not implemented. Did you pass it to context?"
    );
  },
});

type TGalleryContext = {
  activePhotograph: TIIIFBody | undefined;
  setActivePhotograph: Dispatch<SetStateAction<TIIIFBody | undefined>>;
};

export const GalleryContext = createContext<TGalleryContext>({
  activePhotograph: undefined,
  setActivePhotograph: (_: SetStateAction<TIIIFBody | undefined>) => {
    console.error("setActivePhotograph not implemented.");
  },
});
