import { useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import Map from "../mapping/Map.client";
import { ClientOnly } from "remix-utils/client-only";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { costalLabels } from "~/mapStyles";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import PlaceTooltip from "../mapping/PlaceTooltip";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import StyleSwitcher from "../mapping/StyleSwitcher";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { TLonLat, ESRelatedPlace, ESTopic } from "~/esTypes";

interface Props {
  topic: ESTopic;
  className?: string;
}

const TopicMap = ({ topic, className }: Props) => {
  const { map } = useContext(MapContext);
  const [geojson, setGeojson] = useState<FeatureCollection>();
  const [tooltipPlace, setTooltipPlace] = useState<
    ESRelatedPlace | ESPlace | undefined
  >();
  const [hoverLocation, setHoverLocation] = useState<TLonLat>({
    lat: 0,
    lon: 0,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  // const [clickedPlace, setClickedPlace] = useState<
  //   ESRelatedPlace | undefined
  // >();

  useEffect(() => {
    if (!topic.places) return;
    setGeojson(toFeatureCollection(topic.places));
  }, [topic]);

  useEffect(() => {
    if (!topic.places || !map || !geojson) return;

    const handleMouseEnter = ({ features }: MapLayerMouseEvent) => {
      if (!topic.places) return;

      if (features) {
        map.getCanvas().style.cursor = "pointer";
        setTooltipPlace(
          topic.places.find(
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

    // const handleClick = ({ features }: MapLayerMouseEvent) => {
    //   setTooltipPlace(undefined);
    //   if (features) {
    //     map.getCanvas().style.cursor = "pointer";
    //     setClickedPlace(
    //       topic.places?.find(
    //         (place) => place.uuid === features[0].properties.uuid
    //       )
    //     );
    //   } else {
    //     setClickedPlace(undefined);
    //   }
    // };

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

    const sourceId = `place-${topic.uuid}`;

    const clusterLayer = cluster({
      id: `clusters-${topic.uuid}`,
      source: sourceId,
      fillColor: "#1d4ed8",
    });

    const countLayer = clusterCount({
      id: `counts-${topic.uuid}`,
      source: sourceId,
      textColor: "white",
    });

    const pointLayer = singlePoint(`points-${topic.uuid}`, sourceId);

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
    // map.on("click", pointLayer.id, handleClick);
    // map.on("click", clusterLayer.id, handleClick);

    return () => {
      map.off("mousemove", pointLayer.id, handleMouseEnter);
      map.off("mouseleave", pointLayer.id, handleMouseLeave);
      // map.off("click", pointLayer.id, handleClick);
      // map.off("click", clusterLayer.id, handleClick);
      if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
      if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
      if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, geojson, topic]);

  // useEffect(() => {
  //   setTooltipPlace(hoveredPlace);
  // }, [hoveredPlace]);

  useEffect(() => {
    if (!topic.places || !map) return;
    if (tooltipPlace) {
      setHoverLocation(tooltipPlace.location);
      setShowTooltip(true);
    } else {
      map.getCanvas().style.cursor = "";
      setShowTooltip(false);
    }
  }, [map, tooltipPlace, topic]);

  // useEffect(() => {
  //   setActivePlace(clickedPlace);
  // }, [setActivePlace, clickedPlace]);

  if (topic.places) {
    return (
      <ClientOnly>
        {() => (
          <>
            <Map className={`w-full border-0 ${className}`}>
              <StyleSwitcher />
            </Map>
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
  }

  return null;
};

export default TopicMap;
