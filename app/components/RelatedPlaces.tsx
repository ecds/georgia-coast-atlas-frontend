import { useContext, useEffect, useState } from "react";
import type { MapLayerMouseEvent } from "maplibre-gl";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import RelatedSection from "./RelatedSection";
import { IslandContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TCoreDataPlaceRecord } from "~/types";
import PlacePopup from "./PlacePopup";

interface Props {
  places: TCoreDataPlaceRecord[];
}

const RelatedPlaces = ({ places }: Props) => {
  const { map, mapLoaded } = useContext(IslandContext);
  const [activePlace, setActivePlace] = useState<
    TCoreDataPlaceRecord | undefined
  >(undefined);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    console.log("Map loaded and adding places");
    const geoJSON = toFeatureCollection(places);
    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );
    // Extend the island bounds if related places are beyond the island bounds.
    // TODO: This can probably be removed. Sapelo is the only island with a related
    // place off the island. This is probably an error in the data.
    // FIXME: This doesn't even work. The island fit bounds gets called after this.
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

    const handleClick = (e: MapLayerMouseEvent) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];

      console.log("Map clicked, feature found:", feature);

      const clickedPlace = places.find(
        (place) => place.identifier === feature.properties.identifier,
      );

      if (!clickedPlace) {
        console.error(
          "Clicked place not found in places:",
          feature.properties.identifier,
        );
        return;
      }

      console.log("Setting activePlace:", clickedPlace);
      setActivePlace(clickedPlace);
    };

    map.on("click", "places", handleClick);

    map.on("mouseenter", "places", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("places")) map.removeLayer("places");
        if (map.getSource("places")) map.removeSource("places");
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };
  }, [map, places, mapLoaded]);

  useEffect(() => {
    console.log("activePlace changed:", activePlace);
  }, [activePlace]);

  return (
    <RelatedSection title="Related Places">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {places.map((place) => {
          return (
            <button
              key={place.uuid}
              className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace === place ? "some classes for active" : ""}`}
              onClick={() => {
                console.log("Place button clicked:", place);
                setActivePlace(place);
              }}
            >
              {place.name}
            </button>
          );
        })}
      </div>
      <PlacePopup
        map={map}
        activePlace={activePlace}
        onClose={() => setActivePlace(undefined)}
      />
    </RelatedSection>
  );
};

export default RelatedPlaces;
