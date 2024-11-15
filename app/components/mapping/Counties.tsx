import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import PlacePopup from "../PlacePopup";
import { counties as countyStyle } from "~/mapStyles";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { TCounty } from "~/types";

const Counties = ({ counties }: { counties: TCounty[] }) => {
  const { map } = useContext(MapContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeCounty, setActiveCounty] = useState<string | undefined>(
    undefined
  );
  const [popupLocation, setPopupLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  const handleMouseEnter = useCallback(
    ({ features }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      if (map) {
        map.getCanvas().style.cursor = "pointer";
        if (features && features.length > 0) {
          for (const feature of features) {
            if (hoveredId.current !== feature.id) {
              map.setFeatureState(
                { source: "counties", id: hoveredId.current },
                { hovered: false }
              );
            }
            // setActiveCounty((county) => {
            //   if (feature && county !== feature.properties.name)
            //     return undefined;
            //   return county;
            // });
            hoveredId.current = feature.properties.uuid;
            map.setFeatureState(
              { source: "counties", id: feature.id },
              { hovered: true }
            );
          }
        }
      }
    },
    [map]
  );

  const handleMouseLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "";
      map.setFeatureState(
        { source: "counties", id: hoveredId.current },
        { hovered: false }
      );
      hoveredId.current = undefined;
      setActiveCounty(undefined);
    }
  }, [map]);

  const handleClick = useCallback(
    ({
      features,
      lngLat,
    }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      setPopupLocation({ lon: lngLat.lng, lat: lngLat.lat });
      if (!map) return;
      if (features && features.length > 0)
        setActiveCounty(features[0].properties.name);
    },
    [map]
  );

  useEffect(() => {
    if (!map) return;
    for (const countyLayer of countyStyle.layers) {
      map.setLayoutProperty(countyLayer.id, "visibility", "visible");
    }

    map.on("mousemove", "counties-fill", handleMouseEnter);
    map.on("mouseleave", "counties-fill", handleMouseLeave);
    map.on("click", "counties-fill", handleClick);

    return () => {
      for (const countyLayer of countyStyle.layers) {
        map.setLayoutProperty(countyLayer.id, "visibility", "none");
      }
      map.off("mousemove", "counties-fill", handleMouseEnter);
      map.off("mouseleave", "counties-fill", handleMouseLeave);
      map.off("click", "counties-fill", handleClick);
    };
  }, [map, handleMouseEnter, handleMouseLeave, handleClick]);
  return (
    <>
      {counties.map((county) => {
        return (
          <ClientOnly key={county.uuid}>
            {() => (
              <PlacePopup
                show={activeCounty === county.name}
                onClose={() => setActiveCounty(undefined)}
                zoomToFeature={false}
                location={popupLocation}
              >
                <h4 className="text-xl">{county.name}</h4>
              </PlacePopup>
            )}
          </ClientOnly>
        );
      })}
    </>
  );
};

export default Counties;
