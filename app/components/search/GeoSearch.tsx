import { bbox } from "@turf/turf";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import GeoSearchClusters from "./GeoSearchClusters";
import GeoSearchPoints from "./GeoSearchPoints";
import { LngLatBounds } from "maplibre-gl";
import { defaultBounds } from "~/config";
import type { FeatureCollection } from "geojson";
import type { Location } from "@remix-run/react";
import type { GeoHit } from "instantsearch.js";

let timerId: NodeJS.Timeout | undefined = undefined;
const timeout = 200;

const GeoSearch = ({ location }: { location?: Location }) => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const currentItemsRef = useRef<GeoHit[]>();
  const { map } = useContext(MapContext);
  const { items } = useGeoSearch();

  useEffect(() => {
    if (items.toLocaleString() === currentItemsRef.current?.toLocaleString())
      return;
    if (items) {
      setGeoJSON(hitsToFeatureCollection(items));
      currentItemsRef.current = items;
    }
  }, [items]);

  useEffect(() => {
    if (!map) return;

    const searchParams = new URLSearchParams(location?.search);

    if (location?.state?.bounds && !location.search) {
      const bounds = new LngLatBounds(
        Object.values(location.state.bounds._sw) as [number, number],
        Object.values(location.state.bounds._ne) as [number, number]
      );
      map.fitBounds(bounds);
    } else if (
      searchParams.has("georgia_coast_places[geoSearch][boundingBox]")
    ) {
      const bbox = searchParams
        .get("georgia_coast_places[geoSearch][boundingBox]")
        ?.split(",")
        .map((n) => {
          return parseFloat(n);
        })
        .reverse() as [number, number, number, number];
      map.fitBounds(new LngLatBounds(bbox));
    } else if (geojson && geojson.features.length > 0) {
      const bounds = new LngLatBounds(
        bbox(geojson) as [number, number, number, number]
      );
      map.fitBounds(bounds, { padding: 50 });
    } else {
      map.fitBounds(defaultBounds());
    }
  }, [geojson, map, location]);

  if (geojson) {
    return (
      <>
        <GeoSearchClusters geojson={geojson} />
        <GeoSearchPoints geojson={geojson} />
      </>
    );
  }

  return null;
};

export default GeoSearch;
