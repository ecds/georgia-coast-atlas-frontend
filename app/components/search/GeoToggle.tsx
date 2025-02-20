import { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { MapContext } from "~/contexts";
import { useGeoSearch } from "react-instantsearch";

const GeoToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const { map } = useContext(MapContext);
  const { refine, clearMapRefinement, currentRefinement } = useGeoSearch();
  const [boundsDiff, setBoundsDiff] = useState<boolean>(false);

  useEffect(() => {
    if (!map) return;
    const checkboxBoundsDiff = () => {
      const mapBounds = map.getBounds();
      setBoundsDiff(
        Boolean(currentRefinement) &&
          (mapBounds.getNorthEast().lat !== currentRefinement?.northEast.lat ||
            mapBounds.getNorthEast().lon !== currentRefinement?.northEast.lon ||
            mapBounds.getSouthWest().lat !== currentRefinement?.southWest.lat ||
            mapBounds.getSouthWest().lon !== currentRefinement?.southWest.lon)
      );
    };

    map.on("moveend", checkboxBoundsDiff);

    return () => {
      map.off("moveend", checkboxBoundsDiff);
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
    setBoundsDiff(false);
  };

  return (
    <>
      <div className="col-span-5 justify-self-center">
        <div className="flex flex-col xl:flex-row">
          <div className="me-0 xl:me-2 text-sm text-gray-700">Search Area:</div>
          <Switch
            checked={enabled}
            onChange={toggleSearch}
            className="group relative self-center xl:self-start flex h-7 w-14 cursor-pointer rounded-full bg-active-island/20 p-1 transition-colors duration-200 ease-in-out focus:outline-hidden data-focus:outline-1 data-focus:outline-white data-checked:bg-active-island/50"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-island ring-0 shadow-lg transition duration-200 ease-in-out group-data-checked:translate-x-7"
            />
          </Switch>
        </div>
      </div>
      <div className="col-span-3 pe-2 justify-self-end self-center me-4">
        <button
          className="text-sm bg-island disabled:bg-island/50 disabled:cursor-not-allowed p-2 rounded-md text-white capitalize"
          disabled={!boundsDiff}
          onClick={updateSearchResults}
        >
          update area
        </button>
      </div>
    </>
  );
};

export default GeoToggle;
