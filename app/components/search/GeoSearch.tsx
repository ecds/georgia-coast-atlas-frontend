import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import { largeCluster, singlePoint } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/PlacePopup";
import { addMarkerEvents, removeMarkerEvents } from "~/utils/placeEvents";
import type { TPlaceRecord } from "~/types";
import type { MapLayerMouseEvent } from "maplibre-gl";
import type { FeatureCollection } from "geojson";

let timerId: NodeJS.Timeout | undefined = undefined;
let timeout = 200;

const GeoSearch = () => {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>();
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState } = useInstantSearch();
  const [activePlace, setActivePlace] = useState<TPlaceRecord | undefined>(
    undefined
  );

  const handleBoundsChange = useCallback(() => {
    if (!mapLoaded || !map) return;

    refine({
      northEast: map.getBounds().getNorthEast(),
      southWest: map.getBounds().getSouthWest(),
    });
  }, [map, mapLoaded, refine]);

  const handleUnclusteredPointClick = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || !e.features.length) return;
    // const feature = e.features[0];
    // setActivePlace(clickedPlace);
    // }
  }, []);

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      const hits = renderState.georgia_coast?.infiniteHits?.items;
      if (hits) setGeoJSON(hitsToFeatureCollection(hits));
    }, timeout);
  }, [renderState]);

  useEffect(() => {
    if (!mapLoaded || !map) return;
    map.on("moveend", handleBoundsChange);
  }, [map, mapLoaded, handleBoundsChange]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON) return;

    const mouseenter = () => (map.getCanvas().style.cursor = "pointer");
    const mouseleave = () => (map.getCanvas().style.cursor = "");

    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }

    map.addSource("hits-places", {
      type: "geojson",
      data: geoJSON,
      cluster: true,
      clusterRadius: 10,
    });

    if (!map.getLayer("hits-clusters")) map.addLayer(largeCluster("hits"));
    addMarkerEvents({
      layer: "hits-clusters",
      actions: {
        mouseenter,
        mouseleave,
      },
      map,
    });

    if (!map.getLayer("hits-unclustered-point")) {
      map.addLayer(singlePoint("hits"));
      addMarkerEvents({
        layer: "hits-unclustered-point",
        actions: {
          click: handleUnclusteredPointClick,
          mouseenter,
          mouseleave,
        },
        map,
      });
    }

    return () => {
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
      } catch (error) {
        console.error("Error removing pulsing-dot image:", error);
      }

      try {
        if (map.getLayer("hits-unclustered-point")) {
          map.removeLayer("hits-unclustered-point");
          removeMarkerEvents({
            layer: "hits-unclustered-point",
            actions: {
              click: handleUnclusteredPointClick,
              mouseenter,
              mouseleave,
            },
            map,
          });
        }
      } catch (error) {
        console.error("Error removing hits layer:", error);
      }

      try {
        if (map.getLayer("hits-clusters")) map.removeLayer("hits-clusters");
      } catch (error) {
        console.error("Error removing hits layer:", error);
      }

      try {
        if (map.getSource("hits-places")) map.removeSource("hits-places");
      } catch (error) {
        console.error("Error removing hits source:", error);
      }

      map.off("click", "hits", handleUnclusteredPointClick);
    };
  }, [geoJSON, map, mapLoaded]);

  return (
    <>
      {activePlace && (
        <PlacePopup
          map={map}
          place={activePlace}
          show={Boolean(activePlace)}
          onClose={() => setActivePlace(undefined)}
        />
      )}
    </>
  );
};

export default GeoSearch;
