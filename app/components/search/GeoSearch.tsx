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
// import { indexCollection } from "~/config";
import type { FeatureCollection } from "geojson";

let timerId: NodeJS.Timeout | undefined = undefined;
let timeout = 200;

const GeoSearch = () => {
  const [geojson, setGeoJSON] = useState<FeatureCollection>();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const previousRefinements = useRef<string>();
  const { map } = useContext(MapContext);
  const { items, refine } = useGeoSearch();
  const { renderState } = useInstantSearch();

  const handleBoundsChange = useCallback( ()=> {
      if (!map) return;
      // if (event.originalEvent && event.originalEvent instanceof MouseEvent) {
      //   refine({
      //     northEast: map.getBounds().getNorthEast(),
      //     southWest: map.getBounds().getSouthWest(),
      //   });
      setShowSearchButton(true);
    },[map]);

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const hits = items;
      if (hits) setGeoJSON(hitsToFeatureCollection(hits));
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

    return () => {
      console.log("return renderstate");
    };
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
    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-10">
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
  }

export default GeoSearch;
