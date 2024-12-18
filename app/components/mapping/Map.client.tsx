import maplibregl, { AttributionControl } from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "~/contexts";
import { defaultBounds, topBarHeight } from "~/config";
import { combined } from "~/mapStyles";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const Map = ({ children }: Props) => {
  const { setMap, setMapLoaded } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    let _map: any = undefined;

    try {
      _map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: combined,
        center: [-81.40348956381558, 31.41113196761974],
        zoom: 9,
        maxPitch: 0,
        preserveDrawingBuffer: true,
        attributionControl: false,
      });

      _map.fitBounds(defaultBounds());

      _map.on("load", () => {
        setMap(_map);
        setMapLoaded(true);
      });

      _map.addControl(new AttributionControl({ compact: true }));
    } catch {}

    return () => {
      try {
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
