import { useContext, useEffect } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import { locationToFeatureCollection } from "~/utils/toFeatureCollection";
import type { SourceSpecification } from "maplibre-gl";

const PlaceGeoJSON = () => {
  const { map } = useContext(MapContext);
  const { place } = useContext(PlaceContext);

  useEffect(() => {
    if (!map) return;

    const source: SourceSpecification = {
      type: "geojson",
      data: locationToFeatureCollection(place),
      promoteId: "uuid",
    };

    if (!map.getSource(`place-${place.uuid}`))
      map.addSource(`place-${place.uuid}`, source);

    const point = singlePoint(`place-${place.uuid}`, `place-${place.uuid}`, 16);
    if (!map.getLayer(`place-${place.uuid}`)) map.addLayer(point);

    map.flyTo({
      center: place.location,
      zoom: 16,
    });
  }, [map, place]);

  return null;
};

export default PlaceGeoJSON;
