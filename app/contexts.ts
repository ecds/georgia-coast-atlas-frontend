import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AddLayerObject, Map } from "maplibre-gl";
import type { TIslandConfig, TPlaceRecord, TPlaceSource } from "./types";
import type { FeatureCollection } from "geojson";

type TMapContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

type TPlaceContext = {
  place: TPlaceRecord | TIslandConfig;
  activeLayers: AddLayerObject[];
  setActiveLayers: Dispatch<SetStateAction<AddLayerObject[]>>;
  geoJSON?: FeatureCollection;
  layerSources: TPlaceSource;
  setLayerSources: Dispatch<SetStateAction<TPlaceSource>>;
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
  activeLayers: [],
  layerSources: {},
  setActiveLayers: (_: SetStateAction<AddLayerObject[]>) => {
    console.error(
      "setActiveLayers not implemented. Did you pass it to context?",
    );
  },
  setLayerSources: (_: SetStateAction<TPlaceSource>) => {
    console.error(
      "setLayerSources not implemented. Did you pass it to context?",
    );
  },
});
