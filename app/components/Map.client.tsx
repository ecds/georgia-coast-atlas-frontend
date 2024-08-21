import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import style from "~/data/style.json";
import { topBarHeight, mapLayers } from "~/config";
import "maplibre-gl/dist/maplibre-gl.css";
import MapSwitcher from "./MapSwitcher";
import type { Dispatch, SetStateAction } from "react";
import type { StyleSpecification } from "maplibre-gl";

interface Props {
  map: maplibregl.Map | undefined;
  setMap: Dispatch<SetStateAction<maplibregl.Map | undefined>>;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ map, setMap, setMapLoaded }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setMap || !mapContainerRef.current) return;

    const bounds = new maplibregl.LngLatBounds(
      new maplibregl.LngLat(-82.01409567385569, 30.679059125170696),
      new maplibregl.LngLat(-80.92207334522604, 32.11595891326837)
    );

    const _map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: style as StyleSpecification,
      center: [-81.40348956381558, 31.41113196761974],
      zoom: 9,
    });

    _map.fitBounds(bounds);

    _map.on("load", () => {
      addMapLayers(_map);
      setMap(_map);
      setMapLoaded(true);
    });

    return () => {
      if (_map) _map.remove();
      setMap(undefined);
      setMapLoaded(false);
    };
  }, [setMap, setMapLoaded]);

  const addMapLayers = (_map: maplibregl.Map) => {
    mapLayers.forEach((layer) => {
      _map.addSource(layer.id, {
        type: 'raster',
        tiles: layer.tiles,
        tileSize: 256,
        attribution: layer.attribution,
      });
      _map.addLayer({
        id: `${layer.id}-layer`,
        type: 'raster',
        source: layer.id,
        layout: { visibility: 'none' },
      });
    });
  };

  return (
    <div className="relative">
      <div ref={mapContainerRef} className={`h-[calc(100vh-${topBarHeight})]`}></div>
      <MapSwitcher map={map} />
    </div>
  );
};

export default Map;