import type { AddLayerObject, SourceSpecification } from "maplibre-gl";
import type { ESMapLayer } from "~/esTypes";

interface Props {
  placeLayer: ESMapLayer;
  initialOpacity?: number | undefined;
}

export const wmsLayer = ({ placeLayer, initialOpacity }: Props) => {
  const source: SourceSpecification = {
    type: "raster",
    tiles: [placeLayer.wms_resource],
    tileSize: 256,
  };

  const layer: AddLayerObject = {
    id: placeLayer.uuid,
    source: placeLayer.uuid,
    type: "raster",
    paint: {
      "raster-opacity": initialOpacity ?? 0,
    },
  };

  return {
    source,
    layer,
  };
};
