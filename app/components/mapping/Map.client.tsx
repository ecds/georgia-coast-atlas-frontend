import maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "~/contexts";
import { topBarHeight } from "~/config";
import { baseWithLabels } from "~/mapStyles";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const Map = ({ children }: Props) => {
  const { setMap, setMapLoaded } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    const bounds = new maplibregl.LngLatBounds(
      new maplibregl.LngLat(-82.01409567385569, 30.679059125170696),
      new maplibregl.LngLat(-80.92207334522604, 32.11595891326837),
    );

    let _map: any = undefined;

    try {
      _map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: baseWithLabels,
        center: [-81.40348956381558, 31.41113196761974],
        zoom: 9,
        maxPitch: 0,
        preserveDrawingBuffer: true,
        attributionControl: false,
      });

      _map.fitBounds(bounds);

      _map.on("load", () => {
        setMap(_map);
        setMapLoaded(true);
      });
    } catch {}

    return () => {
      try {
        // if (_map) {
        //   _map.remove();
        // }
        setMap(undefined);
        setMapLoaded(false);
      } catch {}
    };
  }, [setMap, setMapLoaded]);

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
