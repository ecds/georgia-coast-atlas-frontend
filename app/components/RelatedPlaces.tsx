import { useContext, useEffect, useState } from "react";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import RelatedSection from "./RelatedSection";
import { IslandContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlacePopup from "./PlacePopup";
import "maplibre-gl/dist/maplibre-gl.css";
import type { TCoreDataPlaceRecord } from "~/types";

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

    const handleClick = ({ features }: MapLayerMouseEvent) => {
      if (!features || !features.length) return;

      const feature = features[0];

      const clickedPlace = places.find(
        (place) => place.identifier === feature.properties.identifier,
      );

      setActivePlace(clickedPlace);
    };

    // FIXME: This probably isn't best as it assumes this event will
    // always fire before the MapLayerMouseEvent.
    map.on("click", () => {
      setActivePlace(undefined);
    });

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
        map.off("click", "places", handleClick);
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };
  }, [map, places, mapLoaded]);

  return (
    <RelatedSection title="Related Places">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {places.map((place) => {
          return (
            <>
              <button
                key={place.uuid}
                className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace === place ? "underline font-bold" : ""}`}
                onClick={() => {
                  setActivePlace(place);
                }}
              >
                {place.name}
              </button>
              <PlacePopup
                map={map}
                place={place}
                show={activePlace === place}
                onClose={() => setActivePlace(undefined)}
              />
            </>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedPlaces;
