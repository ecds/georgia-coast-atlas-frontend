import { renderToString } from "react-dom/server";
import { useContext, useEffect, useRef, useState } from "react";
import type { Popup } from "maplibre-gl";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import RelatedSection from "./RelatedSection";
import { IslandContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import "maplibre-gl/dist/maplibre-gl.css"; // This was the main issue. Thats my bad.
import type { TCoreDataPlaceRecord } from "~/types";
interface Props {
  places: TCoreDataPlaceRecord[];
}

const RelatedPlaces = ({ places }: Props) => {
  const { map, mapLoaded } = useContext(IslandContext);
  // This is just a reference to the popup so we can close it programmatically.
  const popupRef = useRef<Popup | undefined>(undefined);
  const [activePlace, setActivePlace] = useState<
    TCoreDataPlaceRecord | undefined
  >(undefined);

  useEffect(() => {
    if (!map || !mapLoaded) return;
    console.log("adding");
    const geoJSON = toFeatureCollection(places);
    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number],
    );
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

    map.on("click", "places", (e) => {
      if (popupRef.current?.isOpen()) popupRef.current.remove();
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];

      // This will keep track of the activePlace for use elsewhere.
      setActivePlace(
        places.find(
          (place) => place.identifier === feature.properties.identifier,
        ),
      );

      if (feature.geometry.type !== "Point") return;

      const coordinates = feature.geometry.coordinates as [number, number];
      const description =
        feature.properties?.description || "No description available";

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // This updated the reference to the popup.
      // I'm not sure I really needed to add the `renderToString` here,
      // but it could make future work easier.
      popupRef.current = new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          renderToString(
            <>
              <h4 className="text-xl">{feature.properties.name}</h4>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </>,
          ),
        )
        .addTo(map)
        .on("close", () => setActivePlace(undefined));
    });

    map.on("mouseenter", "places", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      // This will clean everything up during transitions and when
      // you update code during development. This not removing it
      // here is why it seemed to stack multiple popups.
      popupRef.current?.remove();
      try {
        if (!map) return;
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("places")) map.removeLayer("places");
        if (map.getSource("places")) map.removeSource("places");
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };
  }, [map, places, mapLoaded]);

  useEffect(() => {
    // TODO: zoom to/highlight/show popup when some clicks a
    // related place from the list - doing so sets the value
    // for activePlace.
    if (!activePlace) popupRef.current?.remove();
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
