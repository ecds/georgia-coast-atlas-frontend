import type { Map, MapLayerMouseEvent } from "maplibre-gl";

type LayerEvents = {
  actions: {
    click?: (e: MapLayerMouseEvent) => void;
    mouseenter?: () => void;
    mouseleave?: () => void;
  };
  layer: string;
  map: Map;
};

export const addMarkerEvents = ({ layer, actions, map }: LayerEvents) => {
  if (actions.click) map.on("click", layer, actions.click);
  if (actions.mouseenter) map.on("mouseenter", layer, actions.mouseenter);
  if (actions.mouseleave) map.on("mouseleave", layer, actions.mouseleave);
};

export const removeMarkerEvents = ({ layer, actions, map }: LayerEvents) => {
  if (actions.click) map.off("click", layer, actions.click);
  if (actions.mouseenter) map.off("mouseenter", layer, actions.mouseenter);
  if (actions.mouseleave) map.off("mouseleave", layer, actions.mouseleave);
};
