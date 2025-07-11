import maplibregl, { AttributionControl, LngLatBounds } from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "~/contexts";
import { defaultBounds } from "~/config";
import { combined } from "~/mapStyles";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ReactNode } from "react";
import type { Map as TMap } from "maplibre-gl";

interface Props {
  children?: ReactNode;
  className?: string;
}

const Map = ({ children, className }: Props) => {
  const { setMap, setMapLoaded } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    let _map: TMap | undefined = undefined;

    try {
      _map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: combined,
        center: [-81.40348956381558, 31.41113196761974],
        zoom: 9,
        maxPitch: 0,
        canvasContextAttributes: {
          preserveDrawingBuffer: true, //Needed for AllMaps
        },
        attributionControl: false,
        maxBounds: new LngLatBounds([
          -85.005165, 29.357851, -75.239729, 33.000659,
        ]),
      });

      if (!_map.getBounds()) _map.fitBounds(defaultBounds());

      _map.once("load", () => {
        setMap(_map);
        setMapLoaded(true);
      });

      _map.addControl(new AttributionControl({ compact: true }));
    } catch (error) {
      console.error(error);
    }

    return () => {
      try {
        setMap(undefined);
        setMapLoaded(false);
      } catch (error) {
        console.error(error);
      }
    };
  }, [setMap, setMapLoaded]);

  return (
    <div className="relative bg-water">
      <div ref={mapContainerRef} className={className ?? "h-topOffset"}></div>
      {children}
    </div>
  );
};

export default Map;
