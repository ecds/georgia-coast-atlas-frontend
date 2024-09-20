import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import type { TRelatedPlaceRecord } from "~/types";
import WMSLayer from "../mapping/WMSLayer";
import RelatedSection from "./RelatedSection";

interface Props {
  layers: TRelatedPlaceRecord[];
}

const RelatedMapLayers = ({ layers }: Props) => {
  const { setMapLayers } = useContext(PlaceContext);
  if (setMapLayers) {
    return (
      <RelatedSection title="Map Layers">
        {layers.map((mapLayer) => {
          return (
            <WMSLayer
              key={`map-layer-${mapLayer.uuid}`}
              layer={mapLayer}
              setGroup={setMapLayers}
            />
          );
        })}
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedMapLayers;
