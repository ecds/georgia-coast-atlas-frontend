import { useCallback, useEffect } from "react";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { modelFieldUUIDs } from "~/config";

import type { Map as TMap } from "maplibre-gl";

interface Props {
  map: TMap | undefined;
  mapLoaded: boolean;
}

const GeoSearch = ({ map, mapLoaded }: Props) => {
  const { refine } = useGeoSearch();
  const { renderState } = useInstantSearch();

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

  useEffect(() => {
    if (!mapLoaded || !map || !renderState.gca.hits) return;
    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }
    for (const hit of renderState.gca.hits.items) {
      map?.addSource(hit.record_id, {
        type: "geojson",
        data: hit.geometry,
      });
      map?.addLayer({
        id: hit.record_id,
        type: "symbol",
        source: hit.record_id,
        layout: {
          "icon-image": "pulsing-dot",
        },
        filter: ["==", "$type", "Point"],
      });
    }
  }, []);

  return <></>;
};

export default GeoSearch;
