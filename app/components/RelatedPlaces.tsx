import { useContext, useEffect, useState } from "react";
import type { MapLayerMouseEvent, Point, GeoJSONSource } from "maplibre-gl";
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
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "places",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1"
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "places",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });

    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "places",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "pulsing-dot",
      }
    });

    const handleClusterClick = async (e: MapLayerMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });
      if (features.length > 0 && features[0].properties && features[0].geometry) {
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource("places") as GeoJSONSource;
        if (source) {
          try {
            const zoom = await source.getClusterExpansionZoom(clusterId);
            const geometry = features[0].geometry;
            if (geometry.type === "Point") {
              map.easeTo({
                center: geometry.coordinates as [number, number],
                zoom: zoom
              });
            }
          } catch (err) {
            console.error("Error expanding cluster:", err);
          }
        }
      }
    };

    const handleUnclusteredPointClick = (e: MapLayerMouseEvent) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      const clickedPlace = places.find(
        (place) => place.identifier === feature.properties.identifier
      );

      setActivePlace(clickedPlace);
    };

    // Clear active place when clicking outside of a point
    map.on("click", () => {
      setActivePlace(undefined);
    });

    map.on("click", "clusters", handleClusterClick);
    map.on("click", "unclustered-point", handleUnclusteredPointClick);

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer("clusters")) map.removeLayer("clusters");
        if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
        if (map.getLayer("unclustered-point")) map.removeLayer("unclustered-point");
        if (map.getSource("places")) map.removeSource("places");
        map.off("click", "clusters", handleClusterClick);
        map.off("click", "unclustered-point", handleUnclusteredPointClick);
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
            <div key={place.uuid}>
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
            </div>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedPlaces;