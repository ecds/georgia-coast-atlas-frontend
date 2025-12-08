import { useContext, useEffect, useState } from "react";
import { Checkbox } from "@headlessui/react";
import { MapContext } from "~/contexts";
import {
  useCurrentRefinements,
  useGeoSearch,
  useSearchBox,
} from "react-instantsearch";
import type { MapLibreEvent } from "maplibre-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";

const GeoToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false);
  const { map } = useContext(MapContext);
  const {
    refine,
    clearMapRefinement,
    currentRefinement: geoRefinement,
  } = useGeoSearch();
  const { items: currentRefinements } = useCurrentRefinements();
  const { query } = useSearchBox();

  useEffect(() => {
    if (!map) return;
    const handelBoundsChange = ({ originalEvent }: MapLibreEvent) => {
      if (!map) return;
      setShowSearchButton(
        Boolean(
          originalEvent &&
            (geoRefinement || currentRefinements.length > 0 || query)
        )
      );
    };

    map.on("moveend", handelBoundsChange);

    return () => {
      map.off("moveend", handelBoundsChange);
    };
  }, [map, geoRefinement, currentRefinements, query]);

  useEffect(() => {
    setShowSearchButton(
      Boolean(geoRefinement || currentRefinements.length > 0 || query)
    );
  }, [geoRefinement, currentRefinements, query]);

  useEffect(() => {
    if (geoRefinement) {
      setEnabled(true);
    } else {
      setEnabled(false);
      setShowSearchButton(false);
    }
  }, [geoRefinement]);

  const searchArea = () => {
    if (!map) return;
    const bounds = map.getBounds();
    refine({
      northEast: bounds.getNorthEast(),
      southWest: bounds.getSouthWest(),
    });
  };

  const toggleSearch = () => {
    if (map) {
      if (geoRefinement) {
        clearMapRefinement();
      } else {
        searchArea();
      }
    }
  };

  const updateSearchResults = () => {
    searchArea();
    setShowSearchButton(false);
  };

  if (!window) {
    return <></>;
  }

  return (
    <div className="flex flex-col md:flex-row w-full space-x-4 px-4 mb-2">
      <div className="flex flex-row">
        <div className="me-1 md:me-2 text-sm text-gray-700">Search Area:</div>
        <Checkbox
          checked={enabled}
          onChange={toggleSearch}
          // className="group relative self-center xl:self-start flex h-7 w-14 cursor-pointer rounded-full bg-island/20 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-island/50"
          className={`group block size-5 rounded border border-black cursor-pointer hover:border-activeIsland transition-colors ${enabled ? "bg-island" : "bg-white"}`}
        >
          <FontAwesomeIcon
            icon={faCheck}
            className={`pb-0.5 ps-0.5 text-white transition-opacity ${enabled ? "opacity-100" : "opacity-0"}`}
          />
        </Checkbox>
      </div>
      <button
        className="text-sm bg-island hover:bg-island/75 disabled:bg-island/50 disabled:cursor-not-allowed drop-shadow-lg active:drop-shadow-none disabled:drop-shadow-none px-2 rounded-md text-white capitalize"
        disabled={
          (!showSearchButton && !enabled) || !showSearchButton || !enabled
        }
        onClick={updateSearchResults}
      >
        update area
      </button>
      {createPortal(
        <div
          className={`fixed top-24 left-2/3 -translate-x-3/4 ${showSearchButton ? "block" : "hidden"}`}
        >
          <button
            className="flex items-center px-3 py-2 text-sm bg-white rounded-full shadow-md hover:bg-gray-100"
            onClick={updateSearchResults}
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-600" />
            Search This Area
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GeoToggle;
