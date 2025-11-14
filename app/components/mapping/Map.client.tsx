import maplibregl, { AttributionControl, LngLatBounds } from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "~/contexts";
import { defaultBounds } from "~/config";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ReactNode } from "react";
import type { StyleSpecification, Map as TMap } from "maplibre-gl";
import { full } from "~/mapStyles/full";

interface Props {
  bearing?: number;
  bounds?: LngLatBounds;
  children?: ReactNode;
  className?: string;
  style?: StyleSpecification;
}

const Map = ({ children, className, bearing, bounds, style }: Props) => {
  const { setMap, setMapLoaded } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    let _map: TMap | undefined = undefined;

    try {
      _map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: full,
        center: bounds?.getCenter() ?? [-81.40348956381558, 31.41113196761974],
        zoom: 9,
        maxPitch: 0,
        canvasContextAttributes: {
          preserveDrawingBuffer: true, //Needed for AllMaps
        },
        attributionControl: false,
        maxBounds: new LngLatBounds([
          -85.60674924999249, 30.35909162440624, -79.8375612136121,
          35.000591132701324,
        ]),
        bearing: bearing ?? 0,
      });

      if (!_map.getBounds()) _map.fitBounds(defaultBounds());

      _map.once("load", () => {
        setMap(_map);
        setMapLoaded(true);
        // _map?.setProjection({ type: "globe" });
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
  }, [setMap, setMapLoaded, bearing, bounds, style]);

  if (!window) {
    return <></>;
  }

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className={`${className ?? "h-topOffset"} bg-water`}
      ></div>
      {children}
    </div>
  );
};

export default Map;
