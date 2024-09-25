import type { TRelatedPlaceRecord } from "~/types";
import WMSLayer from "../mapping/WMSLayer";
import RelatedSection from "./RelatedSection";

interface Props {
  layers: TRelatedPlaceRecord[];
}

const RelatedMapLayers = ({ layers }: Props) => {
  return (
    <RelatedSection title="Map Layers">
      {layers.map((mapLayer) => {
        return (
          <WMSLayer key={`map-layer-${mapLayer.uuid}`} placeLayer={mapLayer} />
        );
      })}
    </RelatedSection>
  );
};

export default RelatedMapLayers;
