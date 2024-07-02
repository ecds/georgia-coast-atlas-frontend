import maplibregl from "maplibre-gl";
import { useEffect } from "react";
import style from "~/data/style.json";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  map: maplibregl.Map | undefined;
  setMap: Dispatch<SetStateAction<maplibregl.Map | undefined>>;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ map, setMap, setMapLoaded }: Props) => {
  useEffect(() => {
    if (!setMap) return;

    const bounds = new maplibregl.LngLatBounds(
      new maplibregl.LngLat(-82.01409567385569, 30.679059125170696),
      new maplibregl.LngLat(-80.92207334522604, 32.11595891326837),
    );

    const _map = new maplibregl.Map({
      container: "mapContainer",
      // @ts-ignore We are loading the style as JSON.
      style,
      center: [-81.40348956381558, 31.41113196761974],
      zoom: 9,
    });

    _map.fitBounds(bounds);

    setMap(_map);

    return () => {
      if (_map) _map.remove();
      setMap(undefined);
    };
  }, [setMap]);

  useEffect(() => {
    if (!map) return;
    map.on("load", async () => {
      setMapLoaded(true);
    });
  }, [map, setMapLoaded]);

  return <div id="mapContainer" className="h-[calc(100vh-5rem)]"></div>;
};

export default Map;
