import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import type { TPlaceRecord, TCoreDataLayer } from "~/types";
import RelatedSection from "../relatedRecords/RelatedSection";

const TopoQuads = ({ quad }: { quad: TPlaceRecord }) => {
  const { activeLayers, setActiveLayers } = useContext(PlaceContext);

  const handleClick = (
    quad: string,
    layer: TCoreDataLayer,
    isActive: boolean,
  ) => {
    if (isActive) {
      const newObj = Object.fromEntries(
        Object.entries(activeLayers).filter(([key]) => key !== quad),
      );
      setActiveLayers(newObj);
    } else {
      setActiveLayers({ ...activeLayers, [quad]: layer });
    }
  };

  if (quad) {
    return (
      <RelatedSection
        title={quad.name}
        titleClassName="text-sm text-gray-700 mt-2 text-left"
        defaultOpen={false}
        topBorder={false}
        horzSpacing="p-1"
      >
        <ul className="px-2">
          {quad.place_layers.map((layer) => {
            const isActive =
              quad.uuid in activeLayers &&
              activeLayers[quad.uuid].id === layer.id;
            return (
              <li key={layer.id} className="py-1">
                <button
                  onClick={() => handleClick(quad.uuid, layer, isActive)}
                  className={`${isActive ? "font-bold" : ""}`}
                >
                  {layer.name}
                </button>
              </li>
            );
          })}
        </ul>
      </RelatedSection>
    );
  }

  return undefined;
};

export default TopoQuads;
