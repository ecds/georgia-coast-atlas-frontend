import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import { modelFieldUUIDs } from "~/config";
import PlacePopup from "~/components/PlacePopup";
import type { TPlaceRecord } from "~/types";
import type { Map, MapLayerMouseEvent, MapMouseEvent } from "maplibre-gl";

const GeoSearch = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState } = useInstantSearch();
  const [activePlace, setActivePlace] = useState<TPlaceRecord | undefined>(undefined);

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

    return () => {
      map.off("moveend", handleBoundsChange);
    };
  }, [map, mapLoaded, handleBoundsChange]);

  useEffect(() => {
    const hits = renderState.gca?.hits?.items;
    if (!mapLoaded || !map || !hits) return;

    const setupMap = () => {
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
    };

    const handleUnclusteredPointClick = (e: MapLayerMouseEvent) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      console.log("Clicked Feature:", feature);

      const clickedHit = hits.find(
        (hit) => hit[modelFieldUUIDs.identifier] === feature.properties.identifier
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
          place_geometry: { geometry_json: clickedHit.geometry } || null,
          user_defined: clickedHit.user_defined || false,
          identifier: clickedHit[modelFieldUUIDs.identifier],
          iiif_manifest: clickedHit.iiif_manifest || null,
        };

        console.log("Active Place Set:", clickedPlace);
        setActivePlace(clickedPlace);
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    setupMap();

    map.on("click", "hits", handleUnclusteredPointClick);
    map.on("mouseenter", "hits", handleMouseEnter);
    map.on("mouseleave", "hits", handleMouseLeave);

    return () => {
      if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
      if (map.getLayer("hits")) map.removeLayer("hits");
      if (map.getSource("hits")) map.removeSource("hits");
      map.off("click", "hits", handleUnclusteredPointClick);
      map.off("mouseenter", "hits", handleMouseEnter);
      map.off("mouseleave", "hits", handleMouseLeave);
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