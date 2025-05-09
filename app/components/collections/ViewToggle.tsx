import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { faMap, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  viewMode: "grid" | "map" | undefined;
  setViewMode: Dispatch<SetStateAction<"grid" | "map" | undefined>>;
}

const ViewToggle = ({ viewMode, setViewMode }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);

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
