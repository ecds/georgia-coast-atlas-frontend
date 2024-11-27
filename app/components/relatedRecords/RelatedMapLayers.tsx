import { useContext } from "react";
import WMSLayer from "../mapping/WMSLayer";
import RelatedSection from "./RelatedSection";
import { PlaceContext } from "~/contexts";

const RelatedMapLayers = () => {
  const { place } = useContext(PlaceContext);

  if (place.map_layers?.length > 0) {
    return (
      <RelatedSection title="Map Layers">
        {place.map_layers.map((mapLayer) => {
          return (
            <WMSLayer
              key={`map-layer-${mapLayer.uuid}`}
              placeLayer={mapLayer}
            />
          );
        })}
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedMapLayers;
