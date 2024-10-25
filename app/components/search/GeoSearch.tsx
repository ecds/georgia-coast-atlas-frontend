import { bbox } from "@turf/turf";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import GeoSearchClusters from "./GeoSearchClusters";
import GeoSearchPoints from "./GeoSearchPoints";
import { LngLatBounds } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { MapLibreEvent } from "maplibre-gl";

let timerId: NodeJS.Timeout | undefined = undefined;
let timeout = 200;

const GeoSearch = () => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const previousRefinements = useRef<string>();
  const [refinementsChanged, setRefinementsChanged] = useState<boolean>(false);
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState } = useInstantSearch();

  const handleBoundsChange = useCallback(
    (event: MapLibreEvent) => {
      if (!mapLoaded || !map) return;

      if (event.originalEvent && event.originalEvent instanceof MouseEvent) {
        refine({
          northEast: map.getBounds().getNorthEast(),
          southWest: map.getBounds().getSouthWest(),
        });
      }
    },
    [map, mapLoaded, refine]
  );

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const hits = renderState.georgia_coast?.geoSearch?.items;
      if (hits) setGeoJSON(hitsToFeatureCollection(hits));
    }, timeout);
  }, [renderState]);

  useEffect(() => {
    if (!mapLoaded || !map) return;
    map.on("moveend", handleBoundsChange);

    return () => {
      map.off("moveend", handleBoundsChange);
    };
  }, [map, mapLoaded, handleBoundsChange]);

  useEffect(() => {
    if (geojson) {
      const bounds = new LngLatBounds(
        bbox(geojson) as [number, number, number, number]
      );
      if (refinementsChanged) map?.fitBounds(bounds);
    }
  }, [geojson, map, refinementsChanged]);

  useEffect(() => {
    if (renderState?.georgia_coast?.currentRefinements?.items) {
      let newRefinements = renderState.georgia_coast.currentRefinements.items
        .map((items) => items.refinements.map((refinement) => refinement.label))
        .flat()
        .sort()
        .toLocaleString();
      newRefinements += renderState.georgia_coast.pagination?.currentRefinement;
      setRefinementsChanged(newRefinements !== previousRefinements.current);
      previousRefinements.current = newRefinements;
    }
  }, [renderState]);

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
