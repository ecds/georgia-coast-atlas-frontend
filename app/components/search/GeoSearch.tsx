import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import GeoSearchClusters from "./GeoSearchClusters";
import type { FeatureCollection } from "geojson";
import GeoSearchPoints from "./GeoSearchPoints";
import { indexCollection } from "~/config";

let timerId: NodeJS.Timeout | undefined = undefined;
let timeout = 200;

const GeoSearch = () => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const { map, mapLoaded } = useContext(MapContext);
  const { refine, currentRefinement } = useGeoSearch();
  const { renderState } = useInstantSearch();

  // const checkBounds = useCallback(() => {
  //   if (!currentRefinement || !map) return;
  //   setTimeout(() => {
  //     const mapNE = map.getBounds().getNorthEast();
  //     const mapSW = map.getBounds().getSouthWest();
  //     const { northEast: rNE, southWest: rSW } = currentRefinement;
  //     if (
  //       mapNE.lat != rNE.lat ||
  //       mapNE.lng != rNE.lng ||
  //       mapSW.lat != rSW.lat ||
  //       mapSW.lng != rSW.lng
  //     ) {
  //       console.log("bounds don't match");
  //     } else {
  //       console.log("bounds match");
  //     }
  //   }, 500);
  // }, [currentRefinement, map]);

  // useEffect(() => {
  //   if (!mapLoaded || !map) return;
  //   map.on("idle", checkBounds);
  // }, [mapLoaded, map, checkBounds]);

  const handleBoundsChange = useCallback(() => {
    if (!mapLoaded || !map) return;

    refine({
      northEast: map.getBounds().getNorthEast(),
      southWest: map.getBounds().getSouthWest(),
    });
  }, [map, mapLoaded, refine]);

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const hits = renderState.georgia_coast?.infiniteHits?.items;
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
