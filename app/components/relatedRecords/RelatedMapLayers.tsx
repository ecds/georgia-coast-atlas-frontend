import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import type { TRelatedPlaceRecord } from "~/types";
import PlaceLayers from "../mapping/PlaceLayers";
import RelatedSection from "./RelatedSection";

interface Props {
  layers: TRelatedPlaceRecord[];
}

const RelatedMapLayers = ({ layers }: Props) => {
  const { setMapLayers } = useContext(PlaceContext);
  if (setMapLayers) {
    return (
      <RelatedSection title="Map Layers">
        <div className="flex flex-wrap justify-around md:justify-start">
          {layers.map((mapLayer) => {
            return (
              <PlaceLayers
                key={`map-layer-${mapLayer.uuid}`}
                layer={mapLayer}
                setGroup={setMapLayers}
              />
            );
          })}
        </div>
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedMapLayers;
