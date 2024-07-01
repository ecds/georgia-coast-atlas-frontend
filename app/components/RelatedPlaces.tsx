import { useContext, useEffect, useState } from "react";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import RelatedSection from "./RelatedSection";
import { IslandContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import type { TCoreDataPlaceRecord } from "~/types";

interface Props {
  places: TCoreDataPlaceRecord[];
}

const RelatedPlaces = ({ places }: Props) => {
  const { map, mapLoaded } = useContext(IslandContext);
  const [activePlace, setActivePlace] = useState<TCoreDataPlaceRecord | undefined>(undefined);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    const geoJSON = toFeatureCollection(places);
    const bounds = new LngLatBounds(bbox(geoJSON) as [number, number, number, number]);
    const newBounds = map.getBounds().extend(bounds);

    map.fitBounds(newBounds, { padding: 100 });

    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }

    map.addSource("places", {
      type: "geojson",
      data: geoJSON,
    });

    map.addLayer({
      id: "places",
      type: "symbol",
      source: "places",
      layout: {
        "icon-image": "pulsing-dot",
      },
      filter: ["==", "$type", "Point"],
    });

    map.on('click', 'places', (e) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      if (feature.geometry.type !== "Point") return;

      const coordinates = feature.geometry.coordinates as [number, number];
      const description = feature.properties?.description || "No description available";

      console.log("Feature clicked:", feature);
      console.log("Coordinates:", coordinates);
      console.log("Description:", description);

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup({ offset: [10, 0], anchor: 'bottom' }) 
        .setLngLat(coordinates)
        .setHTML(`<div class="maplibregl-popup-content">${description}</div>`)
        .addTo(map);
    });

    map.on('mouseenter', 'places', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'places', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      try {
        if (!map) return;
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("places")) map.removeLayer("places");
        if (map.getSource("places")) map.removeSource("places");
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };
  }, [map, places, activePlace, mapLoaded]);

  useEffect(() => {
    // TODO: zoom to/highlight/show popup when some clicks a
    // related place from the list - doing so sets the value
    // for activePlace.
  }, [activePlace]);

  return (
    <RelatedSection title="Related Places">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {places.map((place) => {
          return (
            <button
              key={place.uuid}
              className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace === place ? "some classes for active" : ""}`}
              onClick={() => setActivePlace(place)}
            >
              {place.name}
            </button>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedPlaces;
