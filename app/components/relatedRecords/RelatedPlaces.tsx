import { useCallback, useContext, useEffect, useState } from "react";
import type {
  MapLayerMouseEvent,
  GeoJSONSource,
  SourceSpecification,
} from "maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { pulsingDot } from "~/utils/pulsingDot";
import RelatedSection from "./RelatedSection";
import { MapContext, PlaceContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlacePopup from "../PlacePopup";
import { orderLayers } from "~/utils/orderLayers";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import { Link } from "@remix-run/react";
import type { TRelatedPlaceRecord } from "~/types";

interface Props {
  places: TRelatedPlaceRecord[];
}

const RelatedPlaces = ({ places }: Props) => {
  const { map } = useContext(MapContext);
  const { place, setLayerSources, setActiveLayers } = useContext(PlaceContext);
  const [activePlace, setActivePlace] = useState<
    TRelatedPlaceRecord | undefined
  >(undefined);

  const handleUnclusteredPointClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!e.features || !e.features.length) return;
      const feature = e.features[0];
      const clickedPlace = places.find(
        (place) => place.identifier === feature.properties.identifier
      );

      setActivePlace(clickedPlace);
    },
    [places]
  );

  const handleClusterClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      if (!map) return;
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`${place.uuid}-clusters`],
      });
      if (
        features.length > 0 &&
        features[0].properties &&
        features[0].geometry
      ) {
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource(`${place.uuid}-places`) as GeoJSONSource;
        if (source) {
          try {
            const zoom = await source.getClusterExpansionZoom(clusterId);
            const geometry = features[0].geometry;
            if (geometry.type === "Point") {
              map.easeTo({
                center: geometry.coordinates as [number, number],
                zoom: zoom,
              });
            }
          } catch (err) {
            console.error("Error expanding cluster:", err);
          }
        }
      }
    },
    [map, place]
  );

  useEffect(() => {
    if (!map) return;

    const geoJSON = toFeatureCollection(places);

    const bounds = new LngLatBounds(
      bbox(geoJSON) as [number, number, number, number]
    );

    // Extend the island bounds if related places are beyond the island bounds.
    const newBounds = map.getBounds().extend(bounds);

    map.fitBounds(newBounds, { maxZoom: 14 });

    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geoJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    };

    if (map.getSource(`${place.uuid}-places`)) {
      map.removeSource(`${place.uuid}-places`);
    }

    map.addSource(`${place.uuid}-places`, placesSource);

    const clusterLayer = cluster(
      `clusters-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(clusterLayer.id)) {
      map.addLayer(clusterLayer);
    }

    const countLayer = clusterCount(
      `counts-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(countLayer.id)) {
      map.addLayer(countLayer);
    }

    const unclusteredLayer = singlePoint(
      `points-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(unclusteredLayer.id)) {
      map.addLayer(unclusteredLayer);
    }

    // Clear active place when clicking outside of a point
    map.on("click", () => {
      setActivePlace(undefined);
    });

    map.on("click", clusterLayer.id, handleClusterClick);
    map.on("click", unclusteredLayer.id, handleUnclusteredPointClick);

    map.on("mouseenter", clusterLayer.id, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", clusterLayer.id, () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("mouseenter", unclusteredLayer.id, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", unclusteredLayer.id, () => {
      map.getCanvas().style.cursor = "";
    });

    if (setLayerSources)
      setLayerSources((layerSources) => {
        return { ...layerSources, [`${place.uuid}-places`]: placesSource };
      });

    orderLayers(map, place.uuid);

    return () => {
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
        if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
        if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
        if (map.getLayer(unclusteredLayer.id))
          map.removeLayer(unclusteredLayer.id);
        if (map.getSource(`${place.uuid}-places`))
          map.removeSource(`${place.uuid}-places`);
        if (map.getSource(`${place.uuid}-places`))
          map.removeSource(`${place.uuid}-places`);
        map.off("click", clusterLayer.id, handleClusterClick);
        map.off("click", unclusteredLayer.id, handleUnclusteredPointClick);
      } catch {}
    };
  }, [
    map,
    place,
    handleClusterClick,
    handleUnclusteredPointClick,
    setActiveLayers,
    setLayerSources,
    places,
  ]);

  return (
    <RelatedSection title="Related Places">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {places.map((relatedPlace) => {
          return (
            <div key={relatedPlace.uuid}>
              <button
                key={relatedPlace.uuid}
                className={`text-black/75 hover:text-black text-left md:py-1 ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
                onClick={() => {
                  setActivePlace(relatedPlace);
                }}
              >
                {relatedPlace.name}
              </button>
              <PlacePopup
                location={{
                  lat: relatedPlace.place_geometry.geometry_json.coordinates[1],
                  lon: relatedPlace.place_geometry.geometry_json.coordinates[0],
                }}
                show={activePlace === relatedPlace}
                onClose={() => setActivePlace(undefined)}
              >
                <h4 className="text-xl">{relatedPlace.name}</h4>
                <div
                  dangerouslySetInnerHTML={{
                    __html: relatedPlace.description ?? "",
                  }}
                />
                <Link
                  to={`/places/${relatedPlace.name.replaceAll(" ", "-")}`}
                  state={{ backTo: place.name }}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
                >
                  Read More
                </Link>
              </PlacePopup>
            </div>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedPlaces;
