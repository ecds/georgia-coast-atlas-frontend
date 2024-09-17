import type { Map } from "maplibre-gl";

export const orderLayers = (map: Map, layerId: string, placeId: string) => {
  if (map.getLayer(layerId)) {
    if (map.getLayer(`${placeId}-fill`)) map.moveLayer(`${placeId}-fill`);
    if (map.getLayer(`${placeId}-outline`)) map.moveLayer(`${placeId}-outline`);
    if (map.getLayer(`clusters`)) map.moveLayer(`clusters`);
    if (map.getLayer(`cluster-count`)) map.moveLayer(`cluster-count`);
    if (map.getLayer(`unclustered-point`)) map.moveLayer(`unclustered-point`);
    if (map.getLayer(`${placeId}-fill`))
      map.moveLayer(layerId, `${placeId}-fill`);
  }
};
