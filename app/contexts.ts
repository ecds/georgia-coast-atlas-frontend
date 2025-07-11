import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { ESPlace, ESRelatedMedium, ESRelatedPlace } from "./esTypes";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  activeLayers?: string[];
  activePlace: ESRelatedPlace | ESPlace | undefined;
  clusterFillColor?: string;
  clusterTextColor?: string;
  hoveredPlace: ESRelatedPlace | ESPlace | undefined;
  noTrackMouse?: boolean;
  place: ESPlace | undefined;
  relatedClosed?: boolean;
  setActiveLayers?: Dispatch<SetStateAction<string[]>>;
  setActivePlace: Dispatch<
    SetStateAction<ESRelatedPlace | ESPlace | undefined>
  >;
  setHoveredPlace: Dispatch<
    SetStateAction<ESRelatedPlace | ESPlace | undefined>
  >;
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
    geojson: { type: "FeatureCollection", features: [] },
    identifier: "",
    location: { lat: 0, lon: 0 },
    manifests: [],
    map_layers: [],
    name: "",
    photographs: [],
    other_places: [],
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
  setActivePlace: (_: SetStateAction<ESRelatedPlace | ESPlace | undefined>) => {
    console.error(
      "setActivePlace not implemented. Did you pass it to context?"
    );
  },
  hoveredPlace: undefined,
  setHoveredPlace: (
    _: SetStateAction<ESRelatedPlace | ESPlace | undefined>
  ) => {
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

type TRelatedMediaContext = {
  activeMedium: ESRelatedMedium | undefined;
  setActiveMedium: Dispatch<SetStateAction<ESRelatedMedium | undefined>>;
};

export const RelatedMediaContext = createContext<TRelatedMediaContext>({
  activeMedium: undefined,
  setActiveMedium: (_: SetStateAction<ESRelatedMedium | undefined>) => {
    console.error("setActiveMedium not implemented.");
  },
});
