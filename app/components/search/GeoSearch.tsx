import { bbox } from "@turf/turf";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import GeoSearchClusters from "./GeoSearchClusters";
import GeoSearchPoints from "./GeoSearchPoints";
import { LngLatBounds } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { Location } from "@remix-run/react";

let timerId: NodeJS.Timeout | undefined = undefined;
const timeout = 200;

const GeoSearch = ({ location }: { location?: Location }) => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const { map } = useContext(MapContext);
  const { items } = useGeoSearch();

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      if (items) setGeoJSON(hitsToFeatureCollection(items));
    }, timeout);
  }, [items]);

  useEffect(() => {
    if (geojson && geojson.features.length > 0 && map) {
      const bounds = new LngLatBounds(
        bbox(geojson) as [number, number, number, number]
      );
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [geojson, map, location]);

  return (
    <>
      {geojson ? (
        <>
          <GeoSearchClusters geojson={geojson} />
          <GeoSearchPoints geojson={geojson} />
        </>
      ) : null}
    </>
  );
};

export default GeoSearch;
