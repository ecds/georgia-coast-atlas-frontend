import maplibregl from "maplibre-gl";
import { useEffect } from "react";
import style from "~/data/style.json";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  map: maplibregl.Map | undefined;
  setMap: Dispatch<SetStateAction<maplibregl.Map | undefined>>;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ map, setMap, setMapLoaded }: Props) => {
  useEffect(() => {
    if (!setMap) return;

    const _map = new maplibregl.Map({
      container: "mapContainer",
      // @ts-ignore We are loading the style as JSON.
      style,
      center: [-81.1067, 31.8375],
      zoom: 10,
    });

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
