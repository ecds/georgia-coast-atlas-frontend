import maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "~/contexts";
import style from "~/data/style.json";
import { topBarHeight, mapLayers } from "~/config";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import type { StyleSpecification } from "maplibre-gl";

interface Props {
  children?: ReactNode;
}

const Map = ({ children }: Props) => {
  const { map, setMap, setMapLoaded } = useContext(MapContext);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    const bounds = new maplibregl.LngLatBounds(
      new maplibregl.LngLat(-82.01409567385569, 30.679059125170696),
      new maplibregl.LngLat(-80.92207334522604, 32.11595891326837),
    );

    const _map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: style as StyleSpecification,
      center: [-81.40348956381558, 31.41113196761974],
      zoom: 9,
      maxPitch: 0,
      preserveDrawingBuffer: true,
    });

    _map.fitBounds(bounds);

    _map.on("load", () => {
      addMapLayers(_map);
      setMap(_map);
      setMapLoaded(true);
    });

    const addMapLayers = (_map: maplibregl.Map) => {
      mapLayers.forEach((layer) => {
        _map.addSource(layer.id, {
          type: "raster",
          tiles: layer.tiles,
          tileSize: 256,
          attribution: layer.attribution,
        });
        _map.addLayer({
          id: `${layer.id}-layer`,
          type: "raster",
          source: layer.id,
          layout: { visibility: "none" },
        });
      });
    };

    return () => {
      if (_map) {
        _map.remove();
      }
      setMap(undefined);
      setMapLoaded(false);
    };
  }, [setMap]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className={`h-[calc(100vh-${topBarHeight})]`}
      ></div>
      {children}
    </div>
  );
};

export default Map;
