import { useEffect, useState } from "react";
import type {
  TPlaceRecord,
  TRelatedPlaceRecord,
  TCoreDataLayer,
} from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import IIIFMapLayer from "./IIIFMapLayer";
import { fetchPlaceRecord } from "~/data/coredata";
import RelatedSection from "./RelatedSection";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

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
      <RelatedSection title="Topo Quads">
        {yearGroups.map((year) => {
          return (
            <Disclosure key={`quads-for-${year}`} as="div" className="mb-2">
              <DisclosureButton className="group flex w-full items-center justify-between">
                {year}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="size-5 fill-black/60 group-data-[hover]:fill-black/50 transition-transform duration-700 group-data-[open]:rotate-180 group-data-[open]:-translate-x-5 pr-4"
                />
              </DisclosureButton>
              <DisclosurePanel
                as="div"
                className="mt-2 text-sm/5 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 border-b-2 border-spacing-2"
              >
                {quadGroups[year].map((layer) => {
                  const isActive = visibleLayers.includes(layer);
                  return (
                    <span key={`quad-place-layer-${layer.id}`} className="px-2">
                      <button
                        className={isActive ? "font-bold" : ""}
                        onClick={() => handleClick(layer, isActive)}
                      >
                        {layer.placeName}
                      </button>
                      <IIIFMapLayer layer={layer} show={isActive} />
                    </span>
                  );
                })}
              </DisclosurePanel>
            </Disclosure>
          );
        })}
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedTopoQuads;
