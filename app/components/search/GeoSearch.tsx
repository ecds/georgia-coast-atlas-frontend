import { useCallback, useEffect } from "react";
import { useGeoSearch } from "react-instantsearch";
import type { Map as TMap } from "maplibre-gl";

interface Props {
  map: TMap | undefined;
  mapLoaded: boolean;
}

const GeoSearch = ({ map, mapLoaded }: Props) => {
  const { refine } = useGeoSearch();

  const handleBoundsChange = useCallback(() => {
    if (!mapLoaded || !map) return;

    refine({
      northEast: map.getBounds().getNorthEast(),
      southWest: map.getBounds().getSouthWest(),
    });
  }, [map, mapLoaded, refine]);

  useEffect(() => {
    if (!mapLoaded || !map) return;
    map.on("moveend", handleBoundsChange);
  }, [map, mapLoaded, handleBoundsChange]);

  return <></>;
};

export default GeoSearch;
