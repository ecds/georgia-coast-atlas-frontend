import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { ClientOnly } from "remix-utils/client-only";
import { useNavigate } from "@remix-run/react";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { FeatureCollection } from "geojson";

interface Props {
  geojson: FeatureCollection;
}

const sourceId = "hits-source";
const layerId = "hits-layer";

const GeoSearchPoints = ({ geojson }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!event.features || !event.features.length) return;
      const properties = event.features[0].properties;
      navigate(`/places/${properties.slug}`, {
        state: { backTo: "Search Results" },
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (!mapLoaded || !map || !geojson) return;

    const mouseenter = (event: MapLayerMouseEvent) => {
      if (!event.features) return;
      const features = event.features;
      map.getCanvas().style.cursor = "pointer";
      setClickedLocation({ lat: event.lngLat.lat, lon: event.lngLat.lng });
      setPopupTitle(features[0].properties.name);
      setShowPopup(true);
    };

    const mouseleave = () => {
      map.getCanvas().style.cursor = "";
      setShowPopup(false);
    };

    const layerSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterRadius: 10,
    };

    if (!map.getSource(sourceId)) map.addSource(sourceId, layerSource);

    if (!map.getLayer(layerId)) map.addLayer(singlePoint(layerId, sourceId));

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, mouseenter);
    map.on("mouseleave", layerId, mouseleave);

    return () => {
      if (map.getLayer(layerId)) {
        map.off("click", layerId, handleClick);
        map.off("mouseenter", layerId, mouseenter);
        map.off("mouseleave", layerId, mouseleave);
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [geojson, map, mapLoaded, handleClick]);

  return (
    <ClientOnly>
      {() => (
        <PlacePopup
          location={clickedLocation}
          show={showPopup}
          onClose={() => setShowPopup(false)}
          zoomToFeature={false}
          showCloseButton={false}
        >
          <div>
            <h4>{popupTitle}</h4>
          </div>
        </PlacePopup>
      )}
    </ClientOnly>
  );
};

export default GeoSearchPoints;
