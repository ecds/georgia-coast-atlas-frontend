import type { AddLayerObject, Map } from "maplibre-gl";

export const orderLayers = (
  map: Map,
  placeId: string,
  activeLayers?: AddLayerObject[],
  who?: string,
) => {
  console.log("🚀 ~ who:", who);
  const firstSymbolId = map
    .getStyle()
    .layers.find((layer) => layer.type === "symbol")?.id;

  if (map.getLayer(`${placeId}-fill`))
    map.moveLayer(`${placeId}-fill`, firstSymbolId);
  // if (activeLayers) {
  //   for (const layer of activeLayers) {
  //     if (map.getLayer(layer)) map.moveLayer(layer);
  //   }
  // }
  if (map.getLayer(`${placeId}-outline`)) map.moveLayer(`${placeId}-outline`);
  if (map.getLayer(`${placeId}-clusters`)) map.moveLayer(`${placeId}-clusters`);
  if (map.getLayer(`${placeId}-cluster-count`))
    map.moveLayer(`${placeId}-cluster-count`);
  if (map.getLayer(`${placeId}-unclustered-point`))
    map.moveLayer(`${placeId}-unclustered-point`);
};
