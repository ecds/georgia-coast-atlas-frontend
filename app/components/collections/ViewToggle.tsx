import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { faMap, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";
import { useConfigure, usePagination } from "react-instantsearch";

interface Props {
  viewMode: "grid" | "map" | undefined;
  setViewMode: Dispatch<SetStateAction<"grid" | "map" | undefined>>;
  initialCount?: number;
}

const ViewToggle = ({ viewMode, setViewMode, initialCount = 100 }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  const { refine: pagination, currentRefinement } = usePagination();
  const { refine: hitsPerPage } = useConfigure({
    hitsPerPage: viewMode === "grid" ? 24 : 500,
  });
  // Make refs to these functions to avoid an infinite loop whe mode is changed.
  const currentPageRef = useRef<number>(currentRefinement);
  const initialCountRef = useRef<number>(initialCount);
  const paginationRef = useRef(pagination);
  const hitsPerPageRef = useRef(hitsPerPage);

  useEffect(() => {
    if (viewMode === "grid") currentPageRef.current = currentRefinement;
  }, [viewMode, currentRefinement]);

  useEffect(() => {
    locationRef.current = location;
    const searchParams = new URLSearchParams(location.search);
    const currentMode = searchParams.get("view_mode");
    if (currentMode === "grid" || currentMode === "map")
      setViewMode(currentMode);
  }, [location, setViewMode]);

  useEffect(() => {
    const searchParams = new URLSearchParams(locationRef.current.search);
    searchParams.set("view_mode", viewMode ?? "grid");
    navigate({ search: searchParams.toString() });
  }, [viewMode, navigate]);

  useEffect(() => {
    switch (viewMode) {
      case "map":
        paginationRef.current(0);
        hitsPerPageRef.current({ hitsPerPage: 500 });
        break;
      default:
        paginationRef.current(currentPageRef.current);
        hitsPerPageRef.current({ hitsPerPage: initialCountRef.current });
        break;
    }
  }, [viewMode]);

  return (
    <div className="flex gap-4 md:ms-2 md:my-2">
      <button
        onClick={() => setViewMode("grid")}
        className="border border-island px-2 py-1 rounded-md shadow-md hover:shadow-lg text-island"
      >
        <FontAwesomeIcon icon={faTableCells} /> Grid View
      </button>
      <button
        onClick={() => setViewMode("map")}
        className={`border px-2 py-1 rounded-md shadow-md hover:shadow-lg ${
          viewMode === "map"
            ? "bg-island text-white"
            : "border-island text-island"
        }`}
      >
        <FontAwesomeIcon icon={faMap} /> Map View
      </button>
    </div>
  );
};

export default ViewToggle;
