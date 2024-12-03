import { useCallback, useContext, useEffect, useState } from "react";
import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import RelatedSection from "./RelatedSection";
import { MapContext, PlaceContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlaceTooltip from "../mapping/PlaceTooltip";
import PlacePopup from "../mapping/PlacePopup.client";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import { Link } from "@remix-run/react";
import type {
  MapLayerMouseEvent,
  SourceSpecification,
  GeoJSONSource,
} from "maplibre-gl";
import type { ESRelatedPlace } from "~/esTypes";
import { ClientOnly } from "remix-utils/client-only";

const RelatedPlaces = () => {
  const { map } = useContext(MapContext);
  const { place, clusterFillColor, clusterTextColor } =
    useContext(PlaceContext);
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>(
    undefined
  );
  const [hoveredPlace, setHoveredPlace] = useState<ESRelatedPlace | undefined>(
    undefined
  );
  const [placeBounds, setPlaceBounds] = useState<LngLatBounds | undefined>(
    undefined
  );

  const handleMouseEnter = useCallback(
    ({ features }: MapLayerMouseEvent) => {
      if (!map || !features) return;

      const hovered = place.places.find(
        (relatedPlace) => relatedPlace.uuid === features[0]?.id
      );
      setHoveredPlace(hovered);
      map.getCanvas().style.cursor = "pointer";
    },
    [map, place.places]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPlace(undefined);

    if (map) {
      map.getCanvas().style.cursor = "";
    }
  }, [map]);

  const handleClick = useCallback(
    async ({ features, lngLat }: MapLayerMouseEvent) => {
      if (!map || !features) return;

      const feature = features[0];
      if (!feature) return;

      if (feature.properties?.cluster) {
        const source: GeoJSONSource | undefined = map.getSource(
          feature.layer.source
        );
        if (!source) return;

        const zoom = await source.getClusterExpansionZoom(
          feature.properties.cluster_id
        );
        map.easeTo({
          center: lngLat,
          zoom,
        });
        return;
      }

      const clickedPlace = place.places.find(
        (relatedPlace) => relatedPlace.uuid === feature.id
      );
      setHoveredPlace(undefined);
      setActivePlace(clickedPlace);
    },
    [map, place.places]
  );

  useEffect(() => {
    if (!map) return;
    if (!place.places || place.places.length === 0) return;

    const geojson = toFeatureCollection(place.places);

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    const newBounds = map.getBounds().extend(bounds);

    setPlaceBounds(newBounds);
    map.fitBounds(newBounds, { maxZoom: 14 });

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      promoteId: "uuid",
    };

    if (map.getSource(`${place.uuid}-places`))
      map.removeSource(`${place.uuid}-places`);
    map.addSource(`${place.uuid}-places`, placesSource);

    const clusterLayer = cluster({
      id: `clusters-${place.uuid}`,
      source: `${place.uuid}-places`,
      fillColor: clusterFillColor ?? "#1d4ed8",
    });

    const countLayer = clusterCount({
      id: `counts-${place.uuid}`,
      source: `${place.uuid}-places`,
      textColor: clusterTextColor ?? "white",
    });

    const unclusteredLayer = singlePoint(
      `points-${place.uuid}`,
      `${place.uuid}-places`
    );

    if (!map.getLayer(clusterLayer.id)) map.addLayer(clusterLayer);
    if (!map.getLayer(countLayer.id)) map.addLayer(countLayer);
    if (!map.getLayer(unclusteredLayer.id)) map.addLayer(unclusteredLayer);

    map.on("mouseenter", unclusteredLayer.id, handleMouseEnter);
    map.on("mouseleave", unclusteredLayer.id, handleMouseLeave);
    map.on("click", unclusteredLayer.id, handleClick);
    map.on("click", clusterLayer.id, handleClick);

    return () => {
      map.off("mouseenter", unclusteredLayer.id, handleMouseEnter);
      map.off("mouseleave", unclusteredLayer.id, handleMouseLeave);
      map.off("click", unclusteredLayer.id, handleClick);
      map.off("click", clusterLayer.id, handleClick);
      if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
      if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
      if (map.getLayer(unclusteredLayer.id))
        map.removeLayer(unclusteredLayer.id);
      if (map.getSource(`${place.uuid}-places`))
        map.removeSource(`${place.uuid}-places`);
    };
  }, [map, place, handleClick, handleMouseEnter, handleMouseLeave]);

  if (place.places?.length > 0) {
    return (
      <RelatedSection title="Related Places">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {place.places.map((relatedPlace) => {
            return (
              <div
                key={`related-place-${relatedPlace.uuid}`}
                onMouseEnter={() => setHoveredPlace(relatedPlace)}
                onMouseLeave={() => setHoveredPlace(undefined)}
              >
                <button
                  className={`text-black/75 text-left md:py-1 ${
                    hoveredPlace?.uuid === relatedPlace.uuid
                      ? "bg-gray-200 font-bold"
                      : ""
                  } ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
                  onClick={() => {
                    setActivePlace(relatedPlace);
                  }}
                >
                  {relatedPlace.name}
                </button>
                <ClientOnly>
                  {() => (
                    <>
                      <PlacePopup
                        location={{
                          lat: relatedPlace.location.lat,
                          lon: relatedPlace.location.lon,
                        }}
                        show={activePlace?.uuid === relatedPlace.uuid}
                        onClose={() => setActivePlace(undefined)}
                        zoomToFeature = {false}
                      >
                        <h4 className="text-xl">{relatedPlace.name}</h4>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: relatedPlace.description ?? "",
                          }}
                        />
                        <Link
                          to={`/places/${relatedPlace.slug}`}
                          state={{ backTo: place.name }}
                          className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
                        >
                          Read More
                        </Link>
                      </PlacePopup>
                      <PlaceTooltip
                        location={{
                          lat: relatedPlace.location.lat,
                          lon: relatedPlace.location.lon,
                        }}
                        show={hoveredPlace?.uuid === relatedPlace.uuid}
                        onClose={() => {}}
                        anchor="left"
                        zoomToFeature={false}
                      >
                        <h4 className="text-white">{relatedPlace.name}</h4>
                      </PlaceTooltip>
                    </>
                  )}
                </ClientOnly>
              </div>
            );
          })}
        </div>
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedPlaces;
