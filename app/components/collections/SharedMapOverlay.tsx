import { useEffect, useContext, useState } from "react";
import { MapContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import PlacePopup from "../mapping/PlacePopup.client";
import type { ESRelatedPlace } from "~/esTypes";
import { FeatureCollection } from "geojson";

interface Props {
  places: ESRelatedPlace[];
  zoomTo?: boolean;
}

const SharedMapOverlay = ({ places, zoomTo = true }: Props) => {
  const { map } = useContext(MapContext);
  const [active, setActive] = useState<ESRelatedPlace | undefined>();

  useEffect(() => {
    if (!map || !places.length) return;

    const sourceId = `shared-map-${places[0].uuid}`;
    const features = places.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.location.lon, p.location.lat],
      },
      properties: {
        uuid: p.uuid,
        name: p.name,
      },
    }));

    const geojson = {
      type: "FeatureCollection",
      features,
    } as const;

    if (map.getLayer(sourceId)) map.removeLayer(sourceId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, {
      type: "geojson",
      data: geojson as FeatureCollection,
    });
    map.addLayer(singlePoint(sourceId, sourceId));

    if (zoomTo && features.length === 1) {
      map.flyTo({ center: features[0].geometry.coordinates as [number, number], zoom: 13 });
    }

    const handleClick = (e: any) => {
      const feature = e.features?.[0];
      const match = places.find((p) => p.uuid === feature?.properties?.uuid);
      if (match) setActive(match);
    };

    map.on("click", sourceId, handleClick);

    return () => {
      map.off("click", sourceId, handleClick);
      if (map.getLayer(sourceId)) map.removeLayer(sourceId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, places]);

  return (
    <>
      {active && (
        <PlacePopup
          location={active.location}
          show={true}
          onClose={() => setActive(undefined)}
        >
          {active.preview && (
            <img src={active.preview.replace("max", "600,")} alt="" />
          )}
          <h4 className="text-xl">{active.name}</h4>
          <div dangerouslySetInnerHTML={{ __html: active.description ?? "" }} />
        </PlacePopup>
      )}
    </>
  );
};

export default SharedMapOverlay;
