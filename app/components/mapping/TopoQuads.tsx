import { WarpedMapLayer } from "@allmaps/maplibre";
import { useContext, useEffect, useRef, useState } from "react";
import { PlaceContext } from "~/contexts";
import { fetchPlaceRecord } from "~/data/coredata";
import type { TPlaceRecord, TCoreDataLayer } from "~/types";
import RelatedSection from "../RelatedSection";

const TopoQuads = ({ quadId }: { quadId: string }) => {
  const { map, activeLayers, setActiveLayers } = useContext(PlaceContext);
  const activeQuadRef = useRef<TCoreDataLayer | undefined>(undefined);
  const [quadRecord, setQuadRecord] = useState<TPlaceRecord | null>(null);
  const [activeQuad, setActiveQuad] = useState<TCoreDataLayer | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!map || !quadId) return;
    const fetchRecords = async () => {
      const record = await fetchPlaceRecord(quadId);
      setQuadRecord(record);
      if (record)
        setActiveQuad(
          record.place_layers.find((p) => activeLayers.includes(p.url)),
        );
      activeQuadRef.current = undefined;
    };

    fetchRecords();
  }, [quadId, map]);

  useEffect(() => {
    if (!map) return;
    if (activeQuadRef.current) {
      if (map?.getLayer(activeQuadRef.current.id))
        map.removeLayer(activeQuadRef.current.id);
    }
    if (activeQuad) {
      if (!map.getLayer(activeQuad.id)) {
        const warpedMapLayer = new WarpedMapLayer(activeQuad.id);
        warpedMapLayer.addGeoreferenceAnnotationByUrl(activeQuad.url);
        map?.addLayer(warpedMapLayer);
      }
      activeQuadRef.current = activeQuad;
    }
  }, [activeQuad]);

  useEffect(() => {}, []);

  const removeActiveLayer = (quadToRemove: string, quadToAdd?: string) => {
    if (!setActiveLayers) return;
    const quadPosition = activeLayers?.indexOf(quadToRemove);
    if (quadToAdd) {
      setActiveLayers([...activeLayers?.toSpliced(quadPosition, 1, quadToAdd)]);
    } else {
      setActiveLayers([...activeLayers?.toSpliced(quadPosition, 1)]);
      setActiveQuad(undefined);
    }
  };

  const handleClick = (quad: TCoreDataLayer) => {
    if (quad === activeQuad) {
      removeActiveLayer(quad.url);
      setActiveQuad(undefined);
    } else if (activeQuad) {
      removeActiveLayer(activeQuad.url, quad.url);
      setActiveQuad(quad);
    } else {
      setActiveLayers([...activeLayers, quad.url]);
      setActiveQuad(quad);
    }
  };

  if (quadRecord) {
    return (
      <div className="border-t-2 pt-2">
        <span className="px-4 inline">Topo Quads</span>
        <RelatedSection
          title={quadRecord.name}
          titleClassName="text-sm text-gray-700 mt-2 text-left"
          defaultOpen={false}
          topBorder={false}
          horzSpacing="p-1"
        >
          <ul className="px-2">
            {quadRecord.place_layers.map((layer) => {
              return (
                <li key={layer.id} className="py-1">
                  <button
                    onClick={() => handleClick(layer)}
                    className={`${activeQuad == layer ? "font-bold" : ""}`}
                  >
                    {layer.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </RelatedSection>
      </div>
    );
  }

  return <></>;
};

export default TopoQuads;
