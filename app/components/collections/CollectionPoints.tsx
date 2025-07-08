import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { bbox } from "@turf/turf";
import { LngLatBounds } from "maplibre-gl";
import { MapContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import { useHits } from "react-instantsearch";
import PlacePopup from "../mapping/PlacePopup.client";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { Hit } from "instantsearch.js";
import type { FeatureCollection } from "geojson";

interface Props {
  geojson: FeatureCollection;
  collectionType: string;
}

const CollectionPoints = ({ geojson, collectionType }: Props) => {
  const { map } = useContext(MapContext);
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<Hit>();

  const { items } = useHits();

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

    const handleClick = async ({ features }: MapLayerMouseEvent) => {
      if (!features?.[0]) return;
      const feature = features[0];
      const clickedPlace = items.find(
        (item) => item.uuid === feature?.properties.uuid
      );
      if (clickedPlace)
        navigate(`/collections/${collectionType}/${clickedPlace.slug}`, {
          state: { backTo: `Back to ${collectionType} Collection` },
        });
    };

    const sourceId = "collectionItem";

    const pointLayer = singlePoint(`${sourceId}-points`, sourceId);

    const placesSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 22,
      clusterRadius: 50,
      promoteId: "uuid",
    };

    // Removing in the return is unreliable. This is an ugly double check.
    if (map && map.getLayer(pointLayer.id)) map.removeLayer(pointLayer.id);
    if (map && map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, placesSource);
    map.addLayer(pointLayer);

    const bounds = new LngLatBounds(
      bbox(geojson) as [number, number, number, number]
    );
    map.fitBounds(bounds, { padding: 50, maxZoom: 13 });

    map.on("mousemove", pointLayer.id, handleMouseEnter);
    map.on("mouseleave", pointLayer.id, handleMouseLeave);
    map.on("click", pointLayer.id, handleClick);

    return () => {
      map.off("mousemove", pointLayer.id, handleMouseEnter);
      map.off("mouseleave", pointLayer.id, handleMouseLeave);
      map.off("click", pointLayer.id, handleClick);
      map.removeLayer(pointLayer.id);
      map.removeSource(sourceId);
    };
  }, [map, geojson, navigate, items, collectionType]);

  if (activeItem) {
    return (
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
          dangerouslySetInnerHTML={{ __html: activeItem.description ?? "" }}
        />
      </PlacePopup>
    );
  }

  return null;
};

export default CollectionPoints;
