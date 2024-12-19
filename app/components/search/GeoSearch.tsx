import { bbox } from "@turf/turf";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import GeoSearchClusters from "./GeoSearchClusters";
import GeoSearchPoints from "./GeoSearchPoints";
import { LngLatBounds } from "maplibre-gl";
import type { MapLibreEvent } from "maplibre-gl";
import type { FeatureCollection } from "geojson";

let timerId: NodeJS.Timeout | undefined = undefined;
const timeout = 200;

const GeoSearch = () => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const previousRefinements = useRef<string>();
  const { map } = useContext(MapContext);
  // Use the clearMapRefinement function to remove the bounds refinement.
  const { items, refine /*, clearMapRefinement */ } = useGeoSearch();
  const { renderState } = useInstantSearch();

  const handleBoundsChange = useCallback(
    ({ originalEvent }: MapLibreEvent) => {
      if (!map) return;
      setShowSearchButton(Boolean(originalEvent));
    },
    [map]
  );

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      if (items) setGeoJSON(hitsToFeatureCollection(items));
    }, timeout);
  }, [items]);

  useEffect(() => {
    if (map) {
      map.on("moveend", handleBoundsChange);
    }
    return () => {
      map?.off("moveend", handleBoundsChange);
    };
  }, [map, handleBoundsChange]);

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
  }, [renderState]);

  const updateSearchResults = () => {
    if (map) {
      const bounds = map.getBounds();
      refine({
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest(),
      });
      setShowSearchButton(false);
    }
  };

  const searchByAreaButton = showSearchButton ? (
    <div className="absolute top-4 left-3/4 -translate-x-3/4 z-10">
      <button
        onClick={updateSearchResults}
        className="flex items-center px-3 py-2 text-sm bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-600" />
        Search This Area
      </button>
    </div>
  ) : null;

  return (
    <>
      {searchByAreaButton}
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
