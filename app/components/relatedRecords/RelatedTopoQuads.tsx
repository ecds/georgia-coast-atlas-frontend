import { useContext, useState } from "react";
import { PlaceContext } from "~/contexts";
import IIIFMapLayer from "~/components/mapping/IIIFMapLayer";
import RelatedSection from "./RelatedSection";
import type { ESTopoLayer } from "~/esTypes";

const RelatedTopoQuads = () => {
  const [visibleLayers, setVisibleLayers] = useState<ESTopoLayer[]>([]);
  const { place, activeLayers, setActiveLayers, full } =
    useContext(PlaceContext);

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     const quadData = [];
  //     for (const quad of place.topos) {
  //       const record = await fetchPlaceRecord(quad.uuid);
  //       record?.place_layers.forEach((layer) => (layer.placeName = quad.name));
  //       if (record) quadData.push(record);
  //     }

  //     setQuadRecords(quadData);
  //   };

  //   fetchRecords();
  // }, [quads]);

  // useEffect(() => {
  //   if (!quadRecords) return;
  //   const years: string[] = [
  //     ...new Set(
  //       quadRecords.map((pl) => pl.place_layers.map((l) => l.name)).flat()
  //     ),
  //   ].sort();
  //   setYearGroups(years);
  //   const groups: YearGroup = {};
  //   for (const year of years) {
  //     groups[year] = quadRecords
  //       .map((l) => l.place_layers.filter((l) => l.name == year))
  //       .flat();
  //   }
  //   setQuadGroups(groups);
  // }, [quadRecords]);

  const removeFromActiveLayers = (id: string) => {
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
        activeLayers.map((l) => l).includes(otherVersion.uuid)
      )
        removeFromActiveLayers(otherVersion.uuid);
      setVisibleLayers([
        ...visibleLayers.filter((l) => l.name !== layer.name),
        layer,
      ]);
      setActiveLayers([...activeLayers, layer.uuid]);
    }
  };

  if (full && place.topos?.length > 0) {
    return (
      <RelatedSection title="Topo Quads">
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
