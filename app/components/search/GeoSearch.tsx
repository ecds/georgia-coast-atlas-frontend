import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { useGeoSearch, useInstantSearch } from "react-instantsearch";
import { pulsingDot } from "~/utils/pulsingDot";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import { modelFieldUUIDs } from "~/config";
import PlacePopup from "~/components/PlacePopup";
import type { TPlaceRecord } from "~/types";
import type { MapLayerMouseEvent } from "maplibre-gl";

const GeoSearch = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const { refine } = useGeoSearch();
  const { renderState } = useInstantSearch();
  const [activePlace, setActivePlace] = useState<TPlaceRecord | undefined>(undefined);
  const [places, setPlaces] = useState<TPlaceRecord[]>([]);

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

    setPlaces(hits.map(hit => ({
      uuid: hit.uuid,
      name: hit.name,
      description: hit.description,
      place_names: hit.place_names || [],
      place_layers: hit.place_layers || [],
      web_identifiers: hit.web_identifiers || [],
      place_geometry: { geometry_json: hit.geometry } || null,
      user_defined: hit.user_defined || false,
      identifier: hit[modelFieldUUIDs.identifier],
      iiif_manifest: hit.iiif_manifest || null,
    })));

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
      const clickedHit = hits.find(
        (hit) => hit[modelFieldUUIDs.identifier] === feature.properties.identifier
      );

      if (clickedHit) {
        setActivePlace({
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
        });
      }
    };

    map.on("click", "hits", handleUnclusteredPointClick);

    map.on("mouseenter", "hits", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "hits", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
      } catch (error) {
        console.error("Error removing pulsing-dot image:", error);
      }

      try {
        if (map.getLayer("hits")) map.removeLayer("hits");
      } catch (error) {
        console.error("Error removing hits layer:", error);
      }

      try {
        if (map.getSource("hits")) map.removeSource("hits");
      } catch (error) {
        console.error("Error removing hits source:", error);
      }

      map.off("click", "hits", handleUnclusteredPointClick);
    };
  }, [renderState, map, mapLoaded]);

  return (
    <>
      {places.map(place => (
        <PlacePopup
          key={place.uuid}
          map={map}
          place={place}
          show={activePlace?.identifier === place.identifier}
          onClose={() => setActivePlace(undefined)}
        />
      ))}
    </>
  );
};

export default GeoSearch;
