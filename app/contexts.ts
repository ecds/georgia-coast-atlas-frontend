import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";
import type { TIslandConfig, TPlaceRecord, TActiveLayer } from "./types";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  place: TPlaceRecord | TIslandConfig;
  activeLayers: TActiveLayer;
  setActiveLayers: Dispatch<SetStateAction<TActiveLayer>>;
  topoQuads?: TPlaceRecord[];
  setTopoQuads?: Dispatch<SetStateAction<TPlaceRecord[]>>;
  setMapLayers?: Dispatch<SetStateAction<TPlaceRecord[]>>;
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
  place: { id: "wolf", label: "Wolf", coreDataId: "" },
  activeLayers: {},
  setActiveLayers: (_: SetStateAction<TActiveLayer>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?",
    );
  },
  topoQuads: [],
});
