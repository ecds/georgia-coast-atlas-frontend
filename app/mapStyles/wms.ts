import type { AddLayerObject, SourceSpecification } from "maplibre-gl";

interface Props {
  url: string;
  id: string;
  initialOpacity?: number | undefined;
}

export const wmsLayer = ({ url, id, initialOpacity }: Props) => {
  const source: SourceSpecification = {
    type: "raster",
    tiles: [url],
    tileSize: 256,
  };

  const layer: AddLayerObject = {
    id,
    source: id,
    type: "raster",
    layout: {visibility: initialOpacity === 0 ? "none" : "visible"},
    paint: {
      "raster-opacity": initialOpacity ?? 0,
    },
  };

  return {
    source,
    layer,
  };
};
