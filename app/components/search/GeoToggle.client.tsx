import { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { MapContext } from "~/contexts";
import { useGeoSearch } from "react-instantsearch";
import type { MapLibreEvent } from "maplibre-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";

const GeoToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false);
  const { map } = useContext(MapContext);
  const { refine, clearMapRefinement, currentRefinement } = useGeoSearch();

  useEffect(() => {
    if (!map) return;
    const handelBoundsChange = ({ originalEvent }: MapLibreEvent) => {
      if (!map) return;
      setShowSearchButton(Boolean(originalEvent));
    };

    map.on("moveend", handelBoundsChange);

    return () => {
      map.off("moveend", handelBoundsChange);
    };
  }, [map, currentRefinement]);

  useEffect(() => {
    if (currentRefinement) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [currentRefinement]);

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
      if (currentRefinement) {
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

  return (
    <>
      <div className="col-span-5 justify-self-center">
        <div className="flex flex-col xl:flex-row">
          <div className="me-0 xl:me-2 text-sm text-gray-700">Search Area:</div>
          <Switch
            checked={enabled}
            onChange={toggleSearch}
            className="group relative self-center xl:self-start flex h-7 w-14 cursor-pointer rounded-full bg-island/20 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-island/50"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-island ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
      </div>
      <div className="col-span-3 pe-2 justify-self-end self-center me-4">
        <button
          className="text-sm bg-island disabled:bg-island/50 disabled:cursor-not-allowed p-2 rounded-md text-white capitalize"
          disabled={
            (!showSearchButton && !enabled) || !showSearchButton || !enabled
          }
          onClick={updateSearchResults}
        >
          update area
        </button>
      </div>
      {createPortal(
        <div
          className={`fixed top-24 left-3/4 -translate-x-3/4 ${showSearchButton ? "block" : "hidden"}`}
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
    </>
  );
};

export default GeoToggle;
