import { useEffect, useState } from "react";
import IIIFMapLayer from "./IIIFMapLayer";
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

  const handleClick = (layer: TCoreDataLayer, isActive: boolean) => {
    if (isActive) {
      setVisibleLayers(visibleLayers.filter((l) => l.id !== layer.id));
    } else {
      console.log(
        "🚀 ~ handleClick ~ visibleLayers.filter((l) => l.name !== layer.name:",
        visibleLayers.filter((l) => l.name !== layer.name),
      );
      setVisibleLayers([
        ...visibleLayers.filter((l) => l.placeName !== layer.placeName),
        layer,
      ]);
    }
  };

  if (quadGroups && yearGroups) {
    return (
      <>
        <div className="border-t-2 w-full mx-4">
          <h3 className="p-6">Topo Quads</h3>
        </div>
        {yearGroups.map((year) => {
          return (
            <RelatedSection
              key={`quads-for-${year}`}
              title={year}
              defaultOpen={false}
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
      </>
    );
  }

  return null;
};

export default RelatedTopoQuads;
