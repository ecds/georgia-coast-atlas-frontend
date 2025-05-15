import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { MapContext } from "~/contexts";
import { cluster, clusterCount, singlePoint } from "~/mapStyles/geoJSON";
import { useHits } from "react-instantsearch";
import PlacePopup from "../mapping/PlacePopup.client";
import ClientOnly from "~/components/ClientOnly";
import Map from "../mapping/Map.client";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  SourceSpecification,
} from "maplibre-gl";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import type { Hit } from "instantsearch.js";
import type { FeatureCollection } from "geojson";
import type { CollectionType } from "~/esTypes";

type Props = { className?: string; collectionType: CollectionType };

const CollectionMapOverlay = ({ className, collectionType }: Props) => {
  const { map } = useContext(MapContext);
  const navigate = useNavigate();
  const [geojson, setGeojson] = useState<FeatureCollection>();
  const [activeItem, setActiveItem] = useState<Hit>();
  ``;

  const { items } = useHits();

  useEffect(() => {
    if (!items) return;
    setGeojson(hitsToFeatureCollection(items));
  }, [items]);

  useEffect(() => {
    if (!map || !geojson?.features?.length) return;

    const handleMouseEnter = ({ features }: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const feature = features?.[0];
      setActiveItem(
        items.find((item) => item.uuid === feature?.properties.uuid)
      );
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    const handleClick = async ({ features, lngLat }: MapLayerMouseEvent) => {
      if (!features?.[0]) return;

      const feature = features[0];

      if (feature.properties?.cluster) {
        const source = map.getSource(sourceId) as GeoJSONSource;
        if (!source) return;
        const zoom = await source.getClusterExpansionZoom(
          feature.properties.cluster_id
        );
        map.easeTo({ center: lngLat, zoom });
        return;
      }
      const clickedPlace = items.find(
        (item) => item.uuid === feature?.properties.uuid
      );
      if (clickedPlace)
        navigate(`/collections/${collectionType}/${clickedPlace.slug}`);
    };

    const sourceId = "collection";
    const clusterLayer = cluster({
      id: `${sourceId}-clusters`,
      source: sourceId,
      fillColor: "#1d4ed8",
    });

    const countLayer = clusterCount({
      id: `${sourceId}-counts`,
      source: sourceId,
      textColor: "white",
    });
    const pointLayer = singlePoint(`${sourceId}-points`, sourceId);

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 22,
      clusterRadius: 50,
      promoteId: "uuid",
    };

    if (map.getLayer(clusterLayer.id)) map.removeLayer(clusterLayer.id);
    if (map.getLayer(countLayer.id)) map.removeLayer(countLayer.id);
    if (map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, placesSource);
    map.addLayer(clusterLayer);
    map.addLayer(countLayer);
    map.addLayer(pointLayer);

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    map.fitBounds(bounds, { padding: 50 });

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
  }, [map, geojson, navigate, items, collectionType]);

  return (
    <div className={`mt-6 mx-2 rounded-md overflow-hidden ${className}`}>
      <ClientOnly>
        <Map className={`h-[calc(100vh-15rem)]`}>
          {activeItem && (
            <PlacePopup
              location={activeItem.location}
              show={true}
              onClose={() => setActiveItem(undefined)}
              zoomToFeature={false}
            >
              {activeItem.thumbnail_url && (
                <img src={activeItem.thumbnail_url} alt="" />
              )}
              <h4 className="text-xl">{activeItem.name}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: activeItem.description ?? "",
                }}
              />
            </PlacePopup>
          )}
        </Map>
      </ClientOnly>
    </div>
  );
};

export default CollectionMapOverlay;
