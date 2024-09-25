import { useContext, useEffect, useState } from "react";
import { PlaceContext } from "~/contexts";
import IIIFMapLayer from "~/components/mapping/IIIFMapLayer";
import { fetchPlaceRecord } from "~/data/coredata";
import RelatedSection from "./RelatedSection";
import type {
  TPlaceRecord,
  TRelatedPlaceRecord,
  TCoreDataLayer,
} from "~/types";

type YearGroup = {
  [key: string]: TCoreDataLayer[];
};

interface Props {
  quads: TRelatedPlaceRecord[];
}

const RelatedTopoQuads = ({ quads }: Props) => {
  const [quadRecords, setQuadRecords] = useState<TPlaceRecord[]>();
  const [quadGroups, setQuadGroups] = useState<YearGroup>();
  const [yearGroups, setYearGroups] = useState<string[]>();
  const [visibleLayers, setVisibleLayers] = useState<TCoreDataLayer[]>([]);
  const { activeLayers, setActiveLayers } = useContext(PlaceContext);

  useEffect(() => {
    const fetchRecords = async () => {
      const quadData = [];
      for (const quad of quads) {
        const record = await fetchPlaceRecord(quad.uuid);
        record?.place_layers.forEach((layer) => (layer.placeName = quad.name));
        if (record) quadData.push(record);
      }

      setQuadRecords(quadData);
    };

    fetchRecords();
  }, [quads]);

  useEffect(() => {
    if (!quadRecords) return;
    const years: string[] = [
      ...new Set(
        quadRecords.map((pl) => pl.place_layers.map((l) => l.name)).flat(),
      ),
    ].sort();
    setYearGroups(years);
    const groups: YearGroup = {};
    for (const year of years) {
      groups[year] = quadRecords
        .map((l) => l.place_layers.filter((l) => l.name == year))
        .flat();
    }
    setQuadGroups(groups);
  }, [quadRecords]);

  const removeFromActiveLayers = (id: string) => {
    console.log("🚀 ~ removeFromActiveLayers ~ id:", id);
    setActiveLayers(activeLayers.filter((l) => l.id !== id));
  };

  const handleClick = (layer: TCoreDataLayer, isActive: boolean) => {
    if (isActive) {
      removeFromActiveLayers(layer.id);
      setVisibleLayers(visibleLayers.filter((l) => l.id !== layer.id));
    } else {
      const otherVersion = visibleLayers.find(
        (l) => l.placeName === layer.placeName,
      );
      if (
        otherVersion &&
        activeLayers.map((l) => l.id).includes(otherVersion.id)
      )
        removeFromActiveLayers(otherVersion.id);
      setVisibleLayers([
        ...visibleLayers.filter((l) => l.placeName !== layer.placeName),
        layer,
      ]);
      // setActiveLayers([...activeLayers, layer.id]);
    }
  };

  if (quadGroups && yearGroups) {
    return (
      <RelatedSection title="Topo Quads">
        {yearGroups.map((year) => {
          return (
            <RelatedSection
              key={`quads-for-${year}`}
              title={year}
              defaultOpen={false}
              nested
            >
              {quadGroups[year].map((layer) => {
                const isActive = visibleLayers.includes(layer);
                return (
                  <IIIFMapLayer
                    key={`quad-place-layer-${layer.id}`}
                    layer={layer}
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
