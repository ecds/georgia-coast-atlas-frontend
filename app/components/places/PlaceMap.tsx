import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { pulsingDot } from "~/utils/pulsingDot";
import { toFeatureCollection } from "~/utils/toFeatureCollection";

const PlaceMap = () => {
  const { place } = useContext(PlaceContext);
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map || !place) return;

    const sourceId = `place-${place.uuid}`;
    const geojson = toFeatureCollection([place]);

    map.addSource(sourceId, {
      type: "geojson",
      data: geojson,
      promoteId: "uuid",
    });

    map.addImage(
      "pulsing-dot",
      pulsingDot({ map, color: geojson.features[0].properties.hexColor }),
      { pixelRatio: 2 }
    );

    map.addLayer({
      id: sourceId,
      source: sourceId,
      type: "symbol",
      layout: { "icon-image": "pulsing-dot" },
    });

    return () => {
      map.removeLayer(sourceId);
      map.removeImage("pulsing-dot");
      map.removeSource(sourceId);
    };
  }, [place, map]);

  return <></>;
};

export default PlaceMap;
