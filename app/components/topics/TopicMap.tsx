import { useContext, useEffect } from "react";
import { MapContext } from "~/contexts";
import Map from "../mapping/Map.client";
import { ClientOnly } from "remix-utils/client-only";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import type { FeatureCollection } from "geojson";

interface Props {
  geojson: FeatureCollection;
}

const TopicMap = ({ geojson }: Props) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    // map.scrollZoom.disable();

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );

    map.fitBounds(bounds, { padding: 50 });

    return () => {
      map.scrollZoom.enable();
    };
  }, [map, geojson]);

  return (
    <ClientOnly>
      {() => <Map className="w-full h-[600px] border-0" />}
    </ClientOnly>
  );
};

export default TopicMap;
