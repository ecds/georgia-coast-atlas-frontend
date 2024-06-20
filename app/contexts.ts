import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Map } from "maplibre-gl";

type TIslandContext = {
  map: Map | undefined;
  setMap: Dispatch<SetStateAction<Map | undefined>>;
  mapLoaded: boolean;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
};

export const IslandContext = createContext<TIslandContext>({
  map: undefined,
  setMap: (_: SetStateAction<Map | undefined>) => {
    console.error("setMap not implemented. Did you pass it to context?");
  },
  mapLoaded: false,
  setMapLoaded: (_: SetStateAction<boolean>) => {
    console.error("setHoverState not implemented. Did you pass it to context?");
  },
});
