import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import {
  cluster,
  clusterCount,
  // placePolygon,
  singlePoint,
} from "~/mapStyles/geoJSON";
import PlaceTooltip from "../mapping/PlaceTooltip";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import { areasSourceId } from "~/mapStyles";
import type { FeatureCollection } from "geojson";
import type { TLonLat, ESPlace, ESRelatedPlace } from "~/esTypes";
import type { ReactNode } from "react";

interface Props {
  geojson: FeatureCollection;
  children?: ReactNode;
}

const RelatedPlacesMap = ({ geojson, children }: Props) => {
  const { map } = useContext(MapContext);
  const {
    clusterFillColor,
    clusterTextColor,
    place,
    hoveredPlace,
    setActivePlace,
  } = useContext(PlaceContext);
  const [tooltipPlace, setTooltipPlace] = useState<
    ESRelatedPlace | ESPlace | undefined
  >();
  const [hoverLocation, setHoverLocation] = useState<TLonLat>({
    lat: 0,
    lon: 0,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [clickedPlace, setClickedPlace] = useState<
    ESRelatedPlace | undefined
  >();
  useEffect(() => {
    if (!map || !place) return;

    const handleMouseEnter = async ({ features }: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      if (features) {
        setTooltipPlace(
          place.places.find(
            (place) => place.uuid === features[0].properties.uuid
          )
        );
      } else {
        setTooltipPlace(undefined);
      }
    };

    const handleMouseLeave = () => {
      setTooltipPlace(undefined);
    };

    const handleClick = async ({ features, lngLat }: MapLayerMouseEvent) => {
      setTooltipPlace(undefined);
      if (features) {
        const feature = features[0];
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

        map.getCanvas().style.cursor = "pointer";
        setClickedPlace(
          [...place.places, ...place.other_places].find(
            (place) => place.uuid === feature.properties.uuid
          )
        );
      } else {
        setClickedPlace(undefined);
      }
    };

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );

    map.fitBounds(bounds, { padding: 100, maxZoom: 14 });

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
        { source: areasSourceId, id: place.uuid },
        { hovered: true }
      );
    };

    setColors();
    map.on("styledata", setColors);

    return () => {
      map.setFeatureState(
        { source: areasSourceId, id: place.uuid },
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
  }, [map, geojson, clusterFillColor, clusterTextColor, place]);

  useEffect(() => {
    setTooltipPlace(hoveredPlace);
  }, [hoveredPlace]);

  useEffect(() => {
    if (!map) return;
    if (tooltipPlace) {
      setHoverLocation(tooltipPlace.location);
      setShowTooltip(true);
    } else {
      map.getCanvas().style.cursor = "";
      setShowTooltip(false);
    }
  }, [map, tooltipPlace]);

  useEffect(() => {
    setActivePlace(clickedPlace);
  }, [setActivePlace, clickedPlace]);

  return (
    <ClientOnly>
      {() => (
        <>
          {children}
          <PlaceTooltip
            location={hoverLocation}
            show={showTooltip}
            onClose={() => setTooltipPlace(undefined)}
            zoomToFeature={false}
          >
            <h4 className="text-white">{tooltipPlace?.name}</h4>
          </PlaceTooltip>
        </>
      )}
    </ClientOnly>
  );
};

export default RelatedPlacesMap;
