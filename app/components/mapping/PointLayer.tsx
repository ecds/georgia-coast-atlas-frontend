import { useCallback, useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { pulsingDot } from "~/utils/pulsingDot";
import type {
  AddLayerObject,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import type { TPlaceRecord, TRelatedPlaceRecord } from "~/types";
import type { FeatureCollection } from "geojson";

interface Props {
  place: TPlaceRecord | TRelatedPlaceRecord;
  geoJSON: FeatureCollection;
}

const PointLayer = ({ place, geoJSON }: Props) => {
  const { map } = useContext(MapContext);
  const { setActivePlace } = useContext(PlaceContext);

  useEffect(() => {
    if (!map || !geoJSON) return;

    const sourceID = `${place.uuid}-points`;

    const handlePointClick = (event: MapLayerMouseEvent) => {
      if (!event.features || !event.features.length) return;
      const { features } = event;
      if (features.length > 0) setActivePlace(features[0].properties.uuid);
    };

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geoJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    };

    try {
      // // map.addSource(`${place.uuid}-places`, placesSource);

      if (!map.getSource(sourceID)) map.addSource(sourceID, placesSource);
    } catch {}

    if (!map.getImage("pulsing-dot")) {
      const dot = pulsingDot(map);
      if (dot) {
        map.addImage("pulsing-dot", dot, { pixelRatio: 2 });
      }
    }

    const pointLayer: AddLayerObject = {
      id: place.uuid,
      type: "symbol",
      source: sourceID,
      filter: ["==", "$type", "Point"],
      // filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "pulsing-dot",
      },
    };

    if (!map.getLayer(pointLayer.id)) map.addLayer(pointLayer);

    const mouseenter = () => (map.getCanvas().style.cursor = "pointer");
    const mouseleave = () => (map.getCanvas().style.cursor = "");

    map.on("click", pointLayer.id, handlePointClick);
    map.on("mouseenter", pointLayer.id, mouseenter);
    map.on("mouseleave", pointLayer.id, mouseleave);

    return () => {
      map.off("click", pointLayer.id, handlePointClick);
      map.off("mouseenter", pointLayer.id, mouseenter);
      map.off("mouseleave", pointLayer.id, mouseleave);
      if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
      try {
        if (map.getImage("pulsing-dot")) map.removeImage("pulsing-dot");
      } catch {
        // It might still be in use.
      }
    };
  }, [map, place, geoJSON, setActivePlace]);

  return <></>;
};

export default PointLayer;
