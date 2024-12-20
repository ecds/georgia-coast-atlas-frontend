// TODO: We need to bring this inline with the Islands component.
// We will need to update the shape file on the GeoServer so that
// the properties line up with what is expected from Core Data.
// Specifically, COUNTYNAME needs to be name.
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import PlacePopup from "./PlacePopup.client";
import { masks } from "~/mapStyles";
import PlaceTooltip from "./PlaceTooltip";
import { Link } from "@remix-run/react";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { ESPlace } from "~/esTypes";

const countyStyleLayer = masks.layers.find(
  (layer) => layer.id === "simpleCounties"
);

interface Props {
  counties: ESPlace[];
  hoveredIsland: ESPlace | undefined;
}

const Counties = ({ counties, hoveredIsland }: Props) => {
  const { map } = useContext(MapContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeCounty, setActiveCounty] = useState<string | undefined>(
    undefined
  );
  const [hoveredCounty, setHoveredCounty] = useState<string | undefined>(
    undefined
  );
  const [popupLocation, setPopupLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });
  const [tooltipLocation, setTooltipLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  const handleMouseEnter = useCallback(
    ({
      features,
      lngLat,
    }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      if (hoveredIsland) return;
      if (map) {
        map.getCanvas().style.cursor = "pointer";
        if (features && features.length > 0) {
          for (const feature of features) {
            if (hoveredId.current && hoveredId.current !== feature.id) {
              map.setFeatureState(
                { source: "counties", id: hoveredId.current },
                { hovered: false }
              );
            }
            hoveredId.current = feature.properties.uuid;
            map.setFeatureState(
              { source: "counties", id: feature.id },
              { hovered: true }
            );
            const hoveredCountyName = feature.properties.COUNTYNAME;
            setTooltipLocation({ lon: lngLat.lng, lat: lngLat.lat });
            if (activeCounty != hoveredCountyName)
              setHoveredCounty(hoveredCountyName);
          }
        }
      }
    },
    [map, activeCounty, hoveredIsland]
  );

  const handleMouseLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "";
      map.setFeatureState(
        { source: "counties", id: hoveredId.current },
        { hovered: false }
      );
      hoveredId.current = undefined;
      setHoveredCounty(undefined);
    }
  }, [map]);

  const handleClick = useCallback(
    ({
      features,
      lngLat,
    }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      setHoveredCounty(undefined);
      setPopupLocation({ lon: lngLat.lng, lat: lngLat.lat });
      if (!map) return;
      if (features && features.length > 0) {
        setActiveCounty(features[0].properties.COUNTYNAME);
        setHoveredCounty(undefined);
      }
    },
    [map]
  );

  useEffect(() => {
    if (hoveredIsland) setHoveredCounty(undefined);
  }, [hoveredIsland]);

  useEffect(() => {
    if (!map || !countyStyleLayer) return;
    map.setLayoutProperty(countyStyleLayer.id, "visibility", "visible");

    map.on("mousemove", countyStyleLayer.id, handleMouseEnter);
    map.on("mouseleave", countyStyleLayer.id, handleMouseLeave);
    map.on("click", countyStyleLayer.id, handleClick);

    return () => {
      map.setLayoutProperty(countyStyleLayer.id, "visibility", "none");
      map.off("mousemove", countyStyleLayer.id, handleMouseEnter);
      map.off("mouseleave", countyStyleLayer.id, handleMouseLeave);
      map.off("click", countyStyleLayer.id, handleClick);
    };
  }, [map, handleMouseEnter, handleMouseLeave, handleClick]);

  useEffect(() => {
    if (hoveredCounty) setActiveCounty(undefined);
  }, [hoveredCounty]);

  return (
    <>
      {counties.map((county) => {
        return (
          <ClientOnly key={county.uuid}>
            {() => (
              <>
                <PlacePopup
                  show={activeCounty === county.name}
                  onClose={() => setActiveCounty(undefined)}
                  zoomToFeature={false}
                  location={popupLocation}
                >
                  <h4 className="text-xl">{county.name}</h4>
                  <Link
                    to={`/counties/${county.slug}`}
                    className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                  >
                    Explore
                  </Link>
                </PlacePopup>
                <PlaceTooltip
                  show={hoveredCounty == county.name}
                  location={tooltipLocation}
                  onClose={() => setActiveCounty(undefined)}
                  zoomToFeature={false}
                  anchor="right"
                >
                  <h4 className="text-white">{county.name} County</h4>
                </PlaceTooltip>
              </>
            )}
          </ClientOnly>
        );
      })}
    </>
  );
};

export default Counties;
