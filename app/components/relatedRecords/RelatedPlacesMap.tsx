import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { LngLatBounds } from "maplibre-gl";
import ClientOnly from "~/components/ClientOnly";
import { MapContext, PlaceContext } from "~/contexts";
import {
  cluster,
  clusterCount,
  // placePolygon,
  singlePoint,
} from "~/mapStyles/geoJSON";
import PlaceTooltip from "../mapping/PlaceTooltip";
import { areasSourceId } from "~/mapStyles";
import PlacePopup from "../mapping/PlacePopup.client";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { ReactNode } from "react";

interface Props {
  geojson: FeatureCollection;
  children?: ReactNode;
}

const RelatedPlacesMap = ({ geojson, children }: Props) => {
  const { map } = useContext(MapContext);
  const {
    activePlace,
    activeLayers,
    clusterFillColor,
    clusterTextColor,
    place,
    hoveredPlace,
    setActivePlace,
    setHoveredPlace,
  } = useContext(PlaceContext);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [placeBounds, setPlaceBounds] = useState<LngLatBounds | undefined>();
  const activePlaceRef = useRef(activePlace);

  useEffect(() => {
    activePlaceRef.current = activePlace;
  }, [activePlace]);

  useEffect(() => {
    if (!map || !place) return;

    const handleMouseEnter = async ({ features }: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      if (activePlaceRef.current) return;
      if (features) {
        setHoveredPlace(
          [...place.places, ...place.other_places].find(
            (place) => place.uuid === features[0].properties.uuid
          )
        );
      } else {
        setHoveredPlace(undefined);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPlace(undefined);
    };

    const handleClick = async ({ features, lngLat }: MapLayerMouseEvent) => {
      setHoveredPlace(undefined);
      if (features) {
        const feature = features[0];
        setActivePlace(undefined);
        if (feature.properties?.cluster) {
          const source: GeoJSONSource | undefined = map.getSource(
            feature.layer.source
          );
          if (!source) return;

          const zoom = await source.getClusterExpansionZoom(
            feature.properties.cluster_id
          );
          map.easeTo({ center: lngLat, zoom });
          return;
        }

        const clickedPlace = [...place.places, ...place.other_places].find(
          (place) => place.uuid === feature.properties.uuid
        );

        setActivePlace(clickedPlace);
      } else {
        setActivePlace(undefined);
      }
    };

    const bounds = new LngLatBounds(place.bbox);
    setPlaceBounds(bounds);

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      promoteId: "uuid",
    };

    const sourceId = `place-${place.uuid}`;

    const clusterLayer = cluster({
      id: `clusters-${place.uuid}`,
      source: sourceId,
      fillColor: clusterFillColor ?? "#1d4ed8",
    });

    const countLayer = clusterCount({
      id: `counts-${place.uuid}`,
      source: sourceId,
      textColor: clusterTextColor ?? "white",
    });

    const pointLayer = singlePoint(`points-${place.uuid}`, sourceId);

    map.addSource(sourceId, placesSource);
    map.addLayer(clusterLayer);
    map.addLayer(countLayer);
    map.addLayer(pointLayer);

    map.on("mousemove", pointLayer.id, handleMouseEnter);
    map.on("mousemove", clusterLayer.id, handleMouseEnter);
    map.on("mouseleave", pointLayer.id, handleMouseLeave);
    map.on("click", pointLayer.id, handleClick);
    map.on("click", clusterLayer.id, handleClick);

    const setColors = () => {
      map.setFeatureState(
        { source: areasSourceId, id: place.uuid, sourceLayer: areasSourceId },
        { hovered: true }
      );
    };

    setColors();
    map.on("styledata", setColors);

    return () => {
      map.setFeatureState(
        { source: areasSourceId, id: place.uuid, sourceLayer: areasSourceId },
        { hovered: false }
      );
      map.off("mousemove", pointLayer.id, handleMouseEnter);
      map.off("mousemove", clusterLayer.id, handleMouseEnter);
      map.off("mouseleave", pointLayer.id, handleMouseLeave);
      map.off("click", pointLayer.id, handleClick);
      map.off("click", clusterLayer.id, handleClick);
      map.off("styledata", setColors);
      map.removeLayer(clusterLayer.id);
      map.removeLayer(countLayer.id);
      map.removeLayer(pointLayer.id);
      map.removeSource(sourceId);
    };
  }, [
    map,
    geojson,
    clusterFillColor,
    clusterTextColor,
    place,
    setActivePlace,
    setHoveredPlace,
  ]);

  useEffect(() => {
    if (!map) return;
    if (hoveredPlace) {
      setShowTooltip(true);
    } else {
      map.getCanvas().style.cursor = "";
      setShowTooltip(false);
    }
  }, [map, hoveredPlace]);

  useEffect(() => {
    if (!map || !placeBounds) return;
    if (activeLayers?.length == 0) map?.fitBounds(placeBounds);
  }, [activeLayers, placeBounds, map]);

  return (
    <ClientOnly>
      <>
        {children}
        {hoveredPlace && (
          <PlaceTooltip
            location={hoveredPlace.location}
            show={showTooltip}
            onClose={() => setHoveredPlace(undefined)}
            zoomToFeature={false}
          >
            <h4 className="text-white">{hoveredPlace.name}</h4>
          </PlaceTooltip>
        )}
        {activePlace && (
          <PlacePopup
            location={activePlace.location}
            show={Boolean(activePlace)}
            onClose={() => setActivePlace(undefined)}
            zoomToFeature={false}
          >
            {activePlace.featured_photograph && (
              <img
                src={activePlace.featured_photograph.replace("max", "300,")}
                alt=""
              />
            )}
            <h4 className="text-xl">{activePlace.name}</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: activePlace.description ?? "",
              }}
            />
            <Link
              to={`/places/${activePlace.slug}`}
              state={{ slug: place?.slug, title: place?.name }}
              className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
            >
              Read More
            </Link>
          </PlacePopup>
        )}
      </>
    </ClientOnly>
  );
};

export default RelatedPlacesMap;
