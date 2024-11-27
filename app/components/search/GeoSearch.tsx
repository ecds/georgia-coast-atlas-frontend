import { bbox } from "@turf/turf";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import GeoSearchClusters from "./GeoSearchClusters";
import GeoSearchPoints from "./GeoSearchPoints";
import { LngLatBounds } from "maplibre-gl";
// import { indexCollection } from "~/config";
import type { FeatureCollection } from "geojson";

let timerId: NodeJS.Timeout | undefined = undefined;
let timeout = 200;

const GeoSearch = () => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const previousRefinements = useRef<string>();
  const { map } = useContext(MapContext);
  const { items } = useGeoSearch();
  const { renderState } = useInstantSearch();

  // const handleBoundsChange = useCallback(
  //   (event: MapLibreEvent) => {
  //     if (!mapLoaded || !map) return;

  //     if (event.originalEvent && event.originalEvent instanceof MouseEvent) {
  //       refine({
  //         northEast: map.getBounds().getNorthEast(),
  //         southWest: map.getBounds().getSouthWest(),
  //       });
  //     }
  //   },
  //   [map, mapLoaded, refine]
  // );

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const hits = items;
      if (hits) setGeoJSON(hitsToFeatureCollection(hits));
    }, timeout);
  }, [items]);

  // useEffect(() => {
  //   if (map) {
  //     map.on("moveend", handleBoundsChange);
  //   }
  //   return () => {
  //     map?.off("moveend", handleBoundsChange);
  //   };
  // }, [map, handleBoundsChange]);

  useEffect(() => {
    if (geojson && geojson.features.length > 0 && map) {
      const bounds = new LngLatBounds(
        bbox(geojson) as [number, number, number, number]
      );
      const mapBounds = map.getBounds();
      if (
        !mapBounds.contains(bounds.getNorthEast()) ||
        !mapBounds.contains(bounds.getSouthEast())
      )
        map.fitBounds(bounds);
    }
  }, [geojson, map]);

  useEffect(() => {
    if (renderState?.georgia_coast_places?.currentRefinements?.items) {
      let newRefinements =
        renderState.georgia_coast_places.currentRefinements.items
          .map((items) =>
            items.refinements.map((refinement) => refinement.label)
          )
          .flat()
          .sort()
          .toLocaleString();
      newRefinements +=
        renderState.georgia_coast_places.pagination?.currentRefinement;
      // setRefinementsChanged(newRefinements !== previousRefinements.current);
      previousRefinements.current = newRefinements;
    }

    return () => {
      console.log("return renderstate");
    };
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
