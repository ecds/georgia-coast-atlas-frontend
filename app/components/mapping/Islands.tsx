import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PlacePopup from "~/components/mapping/PlacePopup";
import { MapContext } from "~/contexts";
import { ClientOnly } from "remix-utils/client-only";
import { Link } from "@remix-run/react";
import { islands as islandStyle } from "~/mapStyles";
import PlaceTooltip from "./PlaceTooltip";
import type { TPlace } from "~/types";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

interface Props {
  islands: TPlace[];
}

const Islands = ({ islands }: Props) => {
  const { map } = useContext(MapContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeIsland, setActiveIsland] = useState<TPlace | undefined>(
    undefined
  );
  const [hoveredIsland, setHoveredIsland] = useState<TPlace | undefined>(
    undefined
  );

  const handleMouseEnter = useCallback(
    ({ features }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
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
              { source: "islands", id: feature.properties.uuid },
              { hovered: true }
            );
            const currentIsland = islands.find((island: TPlace) => {
              if (features) return island.name === features[0].properties.name;
              return undefined;
            });
            if (activeIsland != currentIsland) setHoveredIsland(currentIsland);
          }
        }
      }
    },
    [map, islands, activeIsland]
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
  }, [map]);

  const handleClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      }
    ) => {
      if (!map && !event.features) return;
      const clickedIsland = islands.find((island: TPlace) => {
        if (event.features)
          return island.name === event.features[0].properties.name;
        return undefined;
      });
      setHoveredIsland(undefined);
      setActiveIsland(clickedIsland);
    },
    [map, islands]
  );

  useEffect(() => {
    if (!map) return;

    for (const islandLayer of islandStyle.layers) {
      map.setLayoutProperty(islandLayer.id, "visibility", "visible");
    }

    map.on("mousemove", "islands-fill", handleMouseEnter);
    map.on("mouseleave", "islands-fill", handleMouseLeave);
    map.on("click", "islands-fill", handleClick);

    return () => {
      for (const islandLayer of islandStyle.layers) {
        map.setLayoutProperty(islandLayer.id, "visibility", "none");
      }
      map.off("mousemove", "islands-fill", handleMouseEnter);
      map.off("mouseleave", "islands-fill", handleMouseLeave);
      map.off("click", "islands-fill", handleClick);
    };
  }, [map, handleClick, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    if (hoveredIsland) setActiveIsland(undefined);
  }, [hoveredIsland]);

  return (
    <>
      {islands.map((island: TPlace) => {
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
                  <Link
                    to={`/islands/${island.slug}`}
                    className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                  >
                    Explore
                  </Link>
                </PlacePopup>
                <PlaceTooltip
                  show={hoveredIsland == island}
                  location={island.location}
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
