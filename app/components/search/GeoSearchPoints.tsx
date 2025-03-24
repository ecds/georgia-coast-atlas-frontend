import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext, SearchContext } from "~/contexts";
import { singlePoint } from "~/mapStyles/geoJSON";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { ClientOnly } from "remix-utils/client-only";
import { useNavigate } from "@remix-run/react";
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

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (!event.features || !event.features.length) return;
      const properties = event.features[0].properties;
      navigate(`/places/${properties.slug}`, {
        state: {
          title: "Search Results",
          slug: "search",
          bounds: map?.getBounds(),
          previous: location.pathname,
          search: location.search,
        },
      });
    },
    [navigate, map]
  );

  useEffect(() => {
    if (!mapLoaded || !map || !geojson) return;

    const mouseenter = (event: MapLayerMouseEvent) => {
      if (event.features) {
        const feature = event.features[0];
        map.getCanvas().style.cursor = "pointer";
        if (feature.geometry.type == "Point") {
          const [lon, lat] = feature.geometry.coordinates;
          setHoveredLocation({ lon, lat });
        }
        setHoveredFeature(feature);
      } else {
        setHoveredFeature(undefined);
      }
    };

    const mouseleave = () => {
      setHoveredFeature(undefined);
    };

    const layerSource: SourceSpecification = {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterRadius: 10,
    };

    if (!map.getSource(sourceId)) map.addSource(sourceId, layerSource);

    // Add the point on top of the labels.
    map.addLayer(singlePoint(layerId, sourceId), "countySeats");

    map.on("click", layerId, handleClick);
    map.on("mousemove", layerId, mouseenter);
    map.on("mouseleave", layerId, mouseleave);

    return () => {
      if (map.getLayer(layerId)) {
        map.off("click", layerId, handleClick);
        map.off("mousemove", layerId, mouseenter);
        map.off("mouseleave", layerId, mouseleave);
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) map.removeSource(sourceId);
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
    } else {
      setPopupTitle(undefined);
      setShowPopup(false);
      map.getCanvas().style.cursor = "";
      setHoveredLocation({ lat: 0, lon: 0 });
    }
  }, [map, hoveredFeature]);

  return (
    <ClientOnly>
      {() => (
        <PlacePopup
          location={hoveredLocation}
          show={showPopup}
          onClose={() => setShowPopup(false)}
          zoomToFeature={false}
          showCloseButton={false}
        >
          <div>
            {hoveredFeature?.properties?.preview && (
              <img
                className="max-h-32 max-w-32"
                src={hoveredFeature?.properties.preview}
                alt=""
              />
            )}
            <h4>{popupTitle}</h4>
          </div>
        </PlacePopup>
      )}
    </ClientOnly>
  );
};

export default GeoSearchPoints;
