import { useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import PlaceTooltip from "../mapping/PlaceTooltip";
import PlacePopup from "../mapping/PlacePopup.client";
import type { GeoJSONSource, MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { TLonLat, ESRelatedPlace } from "~/esTypes";

type Props = {
    geojson: FeatureCollection;
  };
  
  const CollectionMapOverlay = ({ geojson }: Props) => {
    const { map } = useContext(MapContext);
    const [tooltipPlace, setTooltipPlace] = useState<
        ESRelatedPlace | undefined
      >();
    const [hoverLocation, setHoverLocation] = useState<TLonLat>({ lat: 0, lon: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const {
        clusterFillColor,
        clusterTextColor,
        hoveredPlace,
        setHoveredPlace,
        activePlace,
        setActivePlace,
      } = useContext(PlaceContext);
  
    useEffect(() => {
      console.log("geojson features", geojson.features?.length, geojson);
      if (!map || !geojson?.features?.length) return;
  
      const sourceId = "collection-places";
      const clusterLayer = cluster({ id: `${sourceId}-clusters`, source: sourceId, fillColor: "#1d4ed8" });
      const countLayer = clusterCount({ id: `${sourceId}-counts`, source: sourceId, textColor: "white" });
      const pointLayer = singlePoint(`${sourceId}-points`, sourceId);
  
      const placesSource: SourceSpecification = {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        promoteId: "uuid",
      };
  
      // Clean up if exists
      if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
      if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
      if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
  
      map.addSource(sourceId, placesSource);
      map.addLayer(clusterLayer);
      map.addLayer(countLayer);
      map.addLayer(pointLayer);
  
      const bounds = new LngLatBounds(bbox(geojson) as [number, number, number, number]);
      map.fitBounds(bounds, { padding: 50 });
  
      const handleMouseEnter = ({ features }: MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = features?.[0];
        if (feature?.properties?.uuid) {
          const place = feature.properties as ESRelatedPlace;
          setTooltipPlace(place);
          setHoverLocation(place.location);
          setHoveredPlace(place);
        }
      };
  
      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
        setTooltipPlace(undefined);
        setHoveredPlace(undefined);
      };
  
      const handleClick = async ({ features, lngLat }: MapLayerMouseEvent) => {
        setTooltipPlace(undefined);
        if (!features?.[0]) return;
  
        const feature = features[0];
  
        if (feature.properties?.cluster) {
          const source = map.getSource(sourceId) as GeoJSONSource;
          if (!source) return;
          const zoom = await source.getClusterExpansionZoom(feature.properties.cluster_id);
          map.easeTo({ center: lngLat, zoom });
          return;
        }
  
        setActivePlace(feature.properties as ESRelatedPlace);
      };
  
      map.on("mousemove", pointLayer.id, handleMouseEnter);
      map.on("mouseleave", pointLayer.id, handleMouseLeave);
      map.on("click", pointLayer.id, handleClick);
      map.on("click", clusterLayer.id, handleClick);
  
      return () => {
        map.off("mousemove", pointLayer.id, handleMouseEnter);
        map.off("mouseleave", pointLayer.id, handleMouseLeave);
        map.off("click", pointLayer.id, handleClick);
        map.off("click", clusterLayer.id, handleClick);
        if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
        if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
        if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      };
    }, [map, geojson, clusterFillColor, clusterTextColor, setActivePlace, setHoveredPlace]);
  
    useEffect(() => {
        if (hoveredPlace) {
          setTooltipPlace(hoveredPlace);
          setHoverLocation(hoveredPlace.location);
        }
      }, [hoveredPlace]);
    return (
      <>
        <PlaceTooltip
          location={hoverLocation}
          show={showTooltip}
          onClose={() => setTooltipPlace(undefined)}
          zoomToFeature={false}
        >
          <h4 className="text-white">{tooltipPlace?.name}</h4>
        </PlaceTooltip>
  
        {activePlace && (
          <PlacePopup
            location={activePlace.location}
            show={true}
            onClose={() => setActivePlace(undefined)}
            zoomToFeature={false}
          >
            {activePlace.preview && (
              <img src={activePlace.preview.replace("max", "600,")} alt="" />
            )}
            <h4 className="text-xl">{activePlace.name}</h4>
            <div dangerouslySetInnerHTML={{ __html: activePlace.description ?? "" }} />
          </PlacePopup>
        )}
      </>
    );
  };
  
  export default CollectionMapOverlay;