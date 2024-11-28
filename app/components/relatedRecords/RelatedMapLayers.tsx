import { useContext } from "react";
import WMSLayer from "../mapping/WMSLayer";
import RelatedSection from "./RelatedSection";
import { PlaceContext } from "~/contexts";

const RelatedMapLayers = () => {
  const { place } = useContext(PlaceContext);

  return (
    <RelatedSection title="Map Layers">
      {place.map_layers.map((mapLayer) => {
        return (
          <WMSLayer key={`map-layer-${mapLayer.uuid}`} placeLayer={mapLayer} />
        );
      })}
    </RelatedSection>
  );
};

export default RelatedMapLayers;
