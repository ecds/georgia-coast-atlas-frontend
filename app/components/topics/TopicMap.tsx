import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import Map from "../mapping/Map.client";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { costalLabels } from "~/mapStyles";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import PlaceTooltip from "../mapping/PlaceTooltip";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { TLonLat, ESRelatedPlace } from "~/esTypes";

interface Props {
  geojson: FeatureCollection;
}

const TopicMap = ({ geojson }: Props) => {
  const { map } = useContext(MapContext);
  const {
    clusterFillColor,
    clusterTextColor,
    place,
    hoveredPlace,
    setActivePlace,
  } = useContext(PlaceContext);
  const [tooltipPlace, setTooltipPlace] = useState<
    ESRelatedPlace | undefined
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
    if (!map) return;

    const handleMouseEnter = ({ features }: MapLayerMouseEvent) => {
      if (features) {
        map.getCanvas().style.cursor = "pointer";
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

    const handleClick = ({ features }: MapLayerMouseEvent) => {
      setTooltipPlace(undefined);
      if (features) {
        map.getCanvas().style.cursor = "pointer";
        setClickedPlace(
          place.places.find(
            (place) => place.uuid === features[0].properties.uuid
          )
        );
      } else {
        setClickedPlace(undefined);
      }
    };

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );

    map.fitBounds(bounds, { padding: 50 });

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

    if (map.getSource(sourceId)) map.removeSource(sourceId);
    if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
    if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
    if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);

    map.addSource(sourceId, placesSource);
    map.addLayer(clusterLayer);
    map.addLayer(countLayer);
    map.addLayer(pointLayer, costalLabels.layers[0].id);

    map.on("mousemove", pointLayer.id, handleMouseEnter);
    map.on("mouseleave", pointLayer.id, handleMouseLeave);
    map.on("click", pointLayer.id, handleClick);
    // map.on("click", clusterLayer.id, handleClick);

    return () => {
      map.off("mousemove", pointLayer.id, handleMouseEnter);
      map.off("mouseleave", pointLayer.id, handleMouseLeave);
      map.off("click", pointLayer.id, handleClick);
      // map.off("click", clusterLayer.id, handleClick);
      if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
      if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
      if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
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
    <>
      <Map className="w-full h-[600px] border-0" />
      <PlaceTooltip
        location={hoverLocation}
        show={showTooltip}
        onClose={() => setTooltipPlace(undefined)}
        zoomToFeature={false}
      >
        <h4 className="text-white">{tooltipPlace?.name}</h4>
      </PlaceTooltip>
    </>
  );
};

export default TopicMap;
