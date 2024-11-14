import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { counties } from "~/config";
import { MapContext } from "~/contexts";
import { counties as countyStyle } from "~/mapStyles";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import type { TPlace } from "~/types";

const Counties = () => {
  const { map } = useContext(MapContext);
  const hoveredId = useRef<string | undefined>(undefined);
  const [activeCounty, setActiveCounty] = useState<TPlace | undefined>(
    undefined
  );

  const handleMouseEnter = useCallback(
    ({ features }: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      if (map) {
        map.getCanvas().style.cursor = "pointer";
        if (features && features.length > 0) {
          for (const feature of features) {
            hoveredId.current = feature.properties.uuid;
            map.setFeatureState(
              { source: "counties", id: feature.properties.uuid },
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
    }
  }, [map]);

  // const handleClick = useCallback(
  //   (
  //     event: MapMouseEvent & {
  //       features?: MapGeoJSONFeature[];
  //     }
  //   ) => {
  //     if (!map && !event.features) return;
  //     const clickedIsland = islands.find((island: TPlace) => {
  //       if (event.features)
  //         return island.name === event.features[0].properties.name;
  //       return undefined;
  //     });
  //     setActiveCounty(clickedIsland);
  //   },
  //   [map, islands]
  // );

  useEffect(() => {
    if (!map) return;
    for (const countyLayer of countyStyle.layers) {
      map.setLayoutProperty(countyLayer.id, "visibility", "visible");
    }

    map.on("mouseenter", "counties-fill", handleMouseEnter);
    map.on("mouseleave", "counties-fill", handleMouseLeave);
    // map.on("click", "counties-fill", handleClick);

    return () => {
      for (const countyLayer of countyStyle.layers) {
        map.setLayoutProperty(countyLayer.id, "visibility", "none");
      }
      map.off("mouseenter", "counties-fill", handleMouseEnter);
      map.off("mouseleave", "counties-fill", handleMouseLeave);
      // map.off("click", "counties-fill", handleClick);
    };
  }, [map, handleMouseEnter, handleMouseLeave]);
  return <></>;
};

export default Counties;
