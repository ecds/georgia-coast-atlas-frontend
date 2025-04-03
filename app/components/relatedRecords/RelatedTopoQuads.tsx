import { useContext, useState } from "react";
import { PlaceContext } from "~/contexts";
import IIIFMapLayer from "~/components/mapping/IIIFMapLayer";
import RelatedSection from "./RelatedSection";
import type { ESTopoLayer } from "~/esTypes";

const RelatedTopoQuads = () => {
  const [visibleLayers, setVisibleLayers] = useState<ESTopoLayer[]>([]);
  const { place, activeLayers, setActiveLayers } = useContext(PlaceContext);

  const removeFromActiveLayers = (id: string) => {
    if (setActiveLayers && activeLayers)
      setActiveLayers(activeLayers.filter((l) => l !== id));
  };

  const handleClick = (layer: ESTopoLayer, isActive: boolean) => {
    if (isActive) {
      removeFromActiveLayers(layer.uuid);
      setVisibleLayers(visibleLayers.filter((l) => l.uuid !== layer.uuid));
    } else {
      const otherVersion = visibleLayers.find((l) => l.name === layer.name);
      if (
        otherVersion &&
        activeLayers?.map((l) => l).includes(otherVersion.uuid)
      )
        removeFromActiveLayers(otherVersion.uuid);
      setVisibleLayers([
        ...visibleLayers.filter((l) => l.name !== layer.name),
        layer,
      ]);
      if (setActiveLayers)
        setActiveLayers([...(activeLayers as []), layer.uuid]);
    }
  };

  if (!place || !place.topos) return null;

  if (place.topos.length > 0) {
    return (
      <RelatedSection
        title="Topo Quads"
        headerClassName="mb-2"
        defaultOpen={false}
      >
        {place.topos.map((topo) => {
          return (
            <RelatedSection
              key={`quads-for-${topo.year}`}
              title={topo.year}
              defaultOpen={false}
              nested
            >
              {topo.layers.map((layer) => {
                const isActive = visibleLayers.includes(layer);
                return (
                  <IIIFMapLayer
                    key={`quad-place-layer-${layer.name}`}
                    layer={layer}
                    year={topo.year}
                    show={isActive}
                    onClick={() => handleClick(layer, isActive)}
                  />
                );
              })}
            </RelatedSection>
          );
        })}
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedTopoQuads;
