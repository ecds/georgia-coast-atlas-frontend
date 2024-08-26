import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { TCoreDataPlace } from "./types";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  activeLayers: string[];
  setActiveLayers: Dispatch<SetStateAction<string[]>>;
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
  activeLayers: [],
  setActiveLayers: (_: SetStateAction<string[]>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?",
    );
  },
});
