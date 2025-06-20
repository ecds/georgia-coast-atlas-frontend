import { useCallback, useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import { useLocation, useNavigate } from "react-router";
import { MapContext, SearchContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import type { MapLayerMouseEvent, SourceSpecification } from "maplibre-gl";
import type { Feature, FeatureCollection } from "geojson";

interface Props {
  geojson: FeatureCollection;
}

const sourceId = "hits-source";
const layerId = "hits-layer";

const GeoSearchPoints = ({ geojson }: Props) => {
  const { map, mapLoaded } = useContext(MapContext);
  const { activeResult } = useContext(SearchContext);
  const [hoveredFeature, setHoveredFeature] = useState<Feature | undefined>();
  const [hoveredLocation, setHoveredLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!event.features || !event.features.length) return;
      const properties = event.features[0].properties;
      navigate(`/places/${properties.slug}`, {
        state: {
          title: "Search Results",
          slug: "search",
          bounds: map?.getBounds(),
          previous: `${location.pathname}${location.search}`,
          search: location.search,
        },
      });
    },
    [navigate, map, location]
  );

  useEffect(() => {
    if (!mapLoaded || !map || !geojson) return;

    const mouseMove = (event: MapLayerMouseEvent) => {
      if (event.features) {
        const feature = event.features[0];
        map.getCanvas().style.cursor = "pointer";
        setHoveredLocation({ lon: event.lngLat.lng, lat: event.lngLat.lat });
        setHoveredFeature(feature);
      } else {
        setHoveredFeature(undefined);
      }
    };

    const onMouseLeave = () => setHoveredFeature(undefined);

    const layerSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterRadius: 10,
    };

    map.addSource(sourceId, layerSource);

    // Add the point on top of the labels.
    map.addLayer(singlePoint(layerId, sourceId), "countySeats");

    map.on("click", layerId, handleClick);
    map.on("mousemove", layerId, mouseMove);
    map.on("mouseleave", layerId, onMouseLeave);

    return () => {
      if (map.getLayer(layerId)) {
        map.off("click", layerId, handleClick);
        map.off("mousemove", layerId, mouseMove);
        map.off("mouseleave", layerId, onMouseLeave);
        map.removeLayer(layerId);
      }

      map.removeSource(sourceId);
    };
  }, [geojson, map, mapLoaded, handleClick]);

  useEffect(() => {
    setHoveredFeature(
      geojson.features.find(
        (feature) => feature?.properties?.identifier === activeResult
      )
    );
  }, [activeResult, geojson]);

  useEffect(() => {
    if (!map) return;

    if (hoveredFeature) {
      setPopupTitle(hoveredFeature.properties?.name);
      setShowPopup(true);
      if (hoveredFeature.geometry.type === "Point") {
        const [lon, lat] = hoveredFeature.geometry.coordinates;
        setHoveredLocation({ lon, lat });
      }
    } else {
      setPopupTitle(undefined);
      setShowPopup(false);
      map.getCanvas().style.cursor = "";
      setHoveredLocation({ lat: 0, lon: 0 });
    }
  }, [map, hoveredFeature]);

  return (
    <ClientOnly>
      <PlacePopup
        location={hoveredLocation}
        show={showPopup}
        zoomToFeature={false}
        showCloseButton={false}
      >
        <div>
          {hoveredFeature?.properties?.preview && (
            <img
              className="max-h-32 max-w-32 mt-2 mx-auto"
              src={hoveredFeature?.properties.preview}
              alt=""
            />
          )}
          <h4>{popupTitle}</h4>
        </div>
      </PlacePopup>
    </ClientOnly>
  );
};

export default GeoSearchPoints;
