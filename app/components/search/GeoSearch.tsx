import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import PlacePopup from "~/components/PlacePopup";
import type { TPlaceRecord } from "~/types";
import type { MapLayerMouseEvent } from "maplibre-gl";

const GeoSearch = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState, status, ...rest } = useInstantSearch();
  const [activePlace, setActivePlace] = useState<TPlaceRecord | undefined>(undefined);

  const eventListenerAdded = useRef(false);

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
    const hits = renderState.gca?.hits?.items;
    if (!mapLoaded || !map || !hits) return;

    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }

    if (map.getLayer("hits")) map.removeLayer("hits");
    if (map.getSource("hits")) map.removeSource("hits");

    map.addSource("hits", {
      type: "geojson",
      data: hitsToFeatureCollection(hits),
    });

    map.addLayer({
      id: "hits",
      type: "symbol",
      source: "hits",
      layout: {
        "icon-image": "pulsing-dot",
      },
      filter: ["==", "$type", "Point"],
    });

    const handleUnclusteredPointClick = (e: MapLayerMouseEvent) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      console.log("Clicked Feature:", feature);

      const clickedHit = hits.find(
        (hit) => hit.identifier === feature.properties.identifier
      );

      console.log("Clicked Hit:", clickedHit);

      if (clickedHit) {
        const clickedPlace: TPlaceRecord = {
          uuid: clickedHit.uuid,
          name: clickedHit.name,
          description: clickedHit.description,
          place_names: clickedHit.place_names || [],
          place_layers: clickedHit.place_layers || [],
          web_identifiers: clickedHit.web_identifiers || [],
          place_geometry: clickedHit.place_geometry || null,
          user_defined: clickedHit.user_defined || false,
          identifier: clickedHit.identifier,
          iiif_manifest: clickedHit.iiif_manifest || null,
        };

        console.log("Active Place Set:", clickedPlace);
        setActivePlace(clickedPlace);
      }
    };

    if (!eventListenerAdded.current) {
      map.on("click", "hits", handleUnclusteredPointClick);
      eventListenerAdded.current = true; 
    }

    map.on("mouseenter", "hits", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "hits", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
      if (map.getLayer("hits")) map.removeLayer("hits");
      if (map.getSource("hits")) map.removeSource("hits");
      map.off("click", "hits", handleUnclusteredPointClick);
      eventListenerAdded.current = false; 
    };
  }, [renderState, map, mapLoaded]);

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
