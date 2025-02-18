import { useCallback, useContext, useEffect } from "react";
import { LngLatBounds } from "maplibre-gl";
import { bbox } from "@turf/turf";
import { MapContext, PlaceContext } from "~/contexts";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlaceTooltip from "../mapping/PlaceTooltip";
import PlacePopup from "../mapping/PlacePopup.client";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import { Link } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { costalLabels } from "~/mapStyles";
import type { ESRelatedPlace } from "~/esTypes";
import type {
  MapLayerMouseEvent,
  SourceSpecification,
  GeoJSONSource,
} from "maplibre-gl";

const RelatedPlacesMap = ({
  otherPlaces = [],
}: {
  otherPlaces?: ESRelatedPlace[];
}) => {
  const { map } = useContext(MapContext);
  const {
    place,
    clusterFillColor,
    clusterTextColor,
    activePlace,
    setActivePlace,
    hoveredPlace,
    setHoveredPlace,
  } = useContext(PlaceContext);

  const handleMouseEnter = useCallback(
    ({ features }: MapLayerMouseEvent) => {
      if (!map || !features) return;

      const allPlaces = [...place.places, ...otherPlaces];
      const hovered = allPlaces.find(
        (relatedPlace) => relatedPlace.uuid === features[0]?.id
      );
      setHoveredPlace(hovered);
      map.getCanvas().style.cursor = "pointer";
    },
    [map, place.places, otherPlaces, setHoveredPlace]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPlace(undefined);

    if (map) {
      map.getCanvas().style.cursor = "";
    }
  }, [map, setHoveredPlace]);

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

      const allPlaces = [...place.places, ...otherPlaces];
      const clickedPlace = allPlaces.find(
        (relatedPlace) => relatedPlace.uuid === feature.id
      );
      setHoveredPlace(undefined);
      setActivePlace(clickedPlace);
    },
    [map, place.places, otherPlaces, setActivePlace, setHoveredPlace]
  );

  useEffect(() => {
    if (!map) return;
    if (!place.places || place.places.length === 0) return;

    const allPlaces = [...place.places, ...otherPlaces];
    const geojson = toFeatureCollection(allPlaces);

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    const newBounds = map.getBounds().extend(bounds);

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
    if (!map.getLayer(unclusteredLayer.id))
      map.addLayer(unclusteredLayer, costalLabels.layers[0].id);

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
  }, [
    map,
    otherPlaces,
    place,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    clusterFillColor,
    clusterTextColor,
  ]);

  if (place.places?.length > 0 || otherPlaces.length > 0) {
    return (
      <>
        {[...place.places, ...otherPlaces].map((relatedPlace) => {
          return (
            <ClientOnly key={`related-place-map-${relatedPlace.uuid}`}>
              {() => (
                <>
                  <PlacePopup
                    location={{
                      lat: relatedPlace.location.lat,
                      lon: relatedPlace.location.lon,
                    }}
                    show={activePlace?.uuid === relatedPlace.uuid}
                    onClose={() => setActivePlace(undefined)}
                    zoomToFeature={false}
                  >
                    {relatedPlace.preview && (
                      <img
                        src={relatedPlace.preview.replace("max", "600,")}
                        alt=""
                      />
                    )}
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
          );
        })}
      </>
    );
  }

  return null;
};

export default RelatedPlacesMap;
