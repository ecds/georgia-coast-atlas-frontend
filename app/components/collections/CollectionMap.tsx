import { useContext, useEffect, useState } from "react";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { MapContext } from "~/contexts";
import { useHits } from "react-instantsearch";
import ClientOnly from "~/components/ClientOnly";
import Map from "../mapping/Map.client";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import type { FeatureCollection } from "geojson";
import type { CollectionType } from "~/esTypes";
import CollectionPoints from "./CollectionPoints";
import CollectionClusters from "./CollectionClusters";

type Props = { className?: string; collectionType: CollectionType };

const CollectionMap = ({ className, collectionType }: Props) => {
  const { map } = useContext(MapContext);
  const [geojson, setGeojson] = useState<FeatureCollection>();

  const { items } = useHits();

  useEffect(() => {
    if (!items) return;
    setGeojson(hitsToFeatureCollection(items));
  }, [items]);

  useEffect(() => {
    if (!map || !geojson?.features?.length) return;

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    map.fitBounds(bounds, { padding: 50, maxZoom: 13 });
  }, [map, geojson]);

  if (geojson) {
    return (
      <div
        className={`mt-6 mx-2 rounded-md overflow-hidden ${className} bg-red-600`}
      >
        <ClientOnly>
          <Map className={`h-[calc(100vh-15rem)]`}>
            <CollectionPoints
              geojson={geojson}
              collectionType={collectionType}
            />
            <CollectionClusters
              geojson={geojson}
              collectionType={collectionType}
            />
          </Map>
        </ClientOnly>
      </div>
    );
  }

  return null;
};

export default CollectionMap;
