import { useCallback, useContext, useEffect } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";

const GeoSearch = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState, status, ...rest } = useInstantSearch();

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

    if (status === "idle") {
      if (map?.getLayer("hits")) map.removeLayer("hits");
      if (map?.getSource("hits")) map.removeSource("hits");

      map?.addSource("hits", {
        type: "geojson",
        data: hitsToFeatureCollection(renderState.gca.hits.items),
      });

      map?.addLayer({
        id: "hits",
        type: "symbol",
        source: "hits",
        layout: {
          "icon-image": "pulsing-dot",
        },
        filter: ["==", "$type", "Point"],
      });
    }

    return () => {};
  }, [renderState, map, mapLoaded, status]);

  return null;
};

export default GeoSearch;
