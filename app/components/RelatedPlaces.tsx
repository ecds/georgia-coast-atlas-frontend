import { useContext, useEffect, useState } from "react";
import { LngLatBounds } from "maplibre-gl";
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
  const [activePlace, setActivePlace] = useState<
    TCoreDataPlaceRecord | undefined
  >(undefined);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    // This will give you the GeoJSON to add to the map.
    const geoJSON = toFeatureCollection(places);
    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );

    map.fitBounds(bounds, { padding: 100 });

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

    // TODO: Add interaction here:
    // https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/

    return () => {
      try {
        if (!map) return;
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("places")) map.removeLayer("places");
        if (map.getSource("places")) map.removeSource("places");
      } catch {}
    };
  }, [map, places, activePlace, mapLoaded]);

  useEffect(() => {
    // TODO: zoom to/highlight/show popup when some clicks a
    // replated place from the list - doing so sets the value
    // for activePlace.
  }, [activePlace]);

  return (
    <RelatedSection title="Related Places">
      {places.map((place) => {
        return (
          <button
            key={place.uuid}
            className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace == place ? "some classes for active" : ""}`}
            onClick={() => setActivePlace(place)}
          >
            {place.name}
          </button>
        );
      })}
    </RelatedSection>
  );
};

export default RelatedPlaces;
