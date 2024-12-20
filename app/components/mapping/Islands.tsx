import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PlacePopup from "~/components/mapping/PlacePopup.client";
import { MapContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import { Link } from "@remix-run/react";
import PlaceTooltip from "./PlaceTooltip";
import { islandLayerID } from "~/config";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { ESPlace } from "~/esTypes";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  islands: ESPlace[];
  hoveredIsland: ESPlace | undefined;
  setHoveredIsland: Dispatch<SetStateAction<ESPlace | undefined>>;
}

const Islands = ({ islands, hoveredIsland, setHoveredIsland }: Props) => {
  const { map } = useContext(MapContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeIsland, setActiveIsland] = useState<ESPlace | undefined>(
    undefined
  );
  const [tooltipLocation, setTooltipLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  const handleMouseEnter = useCallback(
    ({
      features,
      lngLat,
    }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      if (map) {
        map.getCanvas().style.cursor = "pointer";
        if (features && features.length > 0) {
          for (const feature of features) {
            if (hoveredId.current && hoveredId.current !== feature.id) {
              map.setFeatureState(
                { source: "islands", id: hoveredId.current },
                { hovered: false }
              );
            }
            hoveredId.current = feature.properties.uuid;
            map.setFeatureState(
              { source: "islands", id: feature.id },
              { hovered: true }
            );
            const currentIsland = islands.find((island) => {
              if (features) return island.name === features[0].properties.name;
              return undefined;
            });
            if (activeIsland != currentIsland) setHoveredIsland(currentIsland);
            setTooltipLocation({ lon: lngLat.lng, lat: lngLat.lat });
          }
        }
      }
    },
    [map, islands, activeIsland, setHoveredIsland]
  );

  const handleMouseLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = "";
      map.setFeatureState(
        { source: "islands", id: hoveredId.current },
        { hovered: false }
      );
      hoveredId.current = undefined;
      setHoveredIsland(undefined);
    }
  }, [map, setHoveredIsland]);

  const handleClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      }
    ) => {
      if (!map && !event.features) return;
      const clickedIsland = islands.find((island) => {
        if (event.features)
          return island.name === event.features[0].properties.name;
        return undefined;
      });
      setHoveredIsland(undefined);
      setActiveIsland(clickedIsland);
    },
    [map, islands, setHoveredIsland]
  );

  useEffect(() => {
    if (!map || !islandLayerID) return;

    // map.setLayoutProperty(islandLayerID, "visibility", "visible");

    map.on("mousemove", islandLayerID, handleMouseEnter);
    map.on("mouseleave", islandLayerID, handleMouseLeave);
    map.on("click", islandLayerID, handleClick);

    return () => {
      // map.setLayoutProperty(islandLayerID, "visibility", "none");
      map.off("mousemove", islandLayerID, handleMouseEnter);
      map.off("mouseleave", islandLayerID, handleMouseLeave);
      map.off("click", islandLayerID, handleClick);
    };
  }, [map, handleClick, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    if (hoveredIsland) setActiveIsland(undefined);
  }, [hoveredIsland]);

  return (
    <>
      {islands.map((island) => {
        return (
          <ClientOnly key={`popup-${island.uuid}`}>
            {() => (
              <>
                <PlacePopup
                  show={activeIsland == island}
                  location={island.location}
                  onClose={() => setActiveIsland(undefined)}
                  zoomToFeature={false}
                >
                  <h4 className="text-xl ">{island.name}</h4>
                  <p>{island.short_description}</p>
                  <Link
                    to={`/islands/${island.slug}`}
                    className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                  >
                    Explore
                  </Link>
                </PlacePopup>
                <PlaceTooltip
                  show={hoveredIsland == island}
                  location={tooltipLocation}
                  onClose={() => setActiveIsland(undefined)}
                  zoomToFeature={false}
                  anchor="left"
                >
                  <h4 className="text-white">{island.name}</h4>
                </PlaceTooltip>
              </>
            )}
          </ClientOnly>
        );
      })}
    </>
  );
};

export default Islands;
