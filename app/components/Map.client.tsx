import maplibregl from "maplibre-gl";
import { WarpedMapLayer } from "@allmaps/maplibre";
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

    return () => {
      if (_map) {
        if (_map.getLayer("fernandina")) _map.removeLayer("fernandina");
        if (_map.getLayer("tybee")) _map.removeLayer("tybee");
        _map.remove();
      }
      setMap(undefined);
      setMapLoaded(false);
    };
  }, [setMap]);

  useEffect(() => {
    if (!map) return;
    map.on("load", async () => {
      setMapLoaded(true);
      const warpedMapLayer = new WarpedMapLayer("fernandina");
      map.addLayer(warpedMapLayer);
      warpedMapLayer.addGeoreferenceAnnotationByUrl(
        "/iiif/annotation-page/2011/Fernandina_Beach",
      );

      const warpedMapLayer2 = new WarpedMapLayer("tybee");
      map.addLayer(warpedMapLayer2);
      warpedMapLayer2.addGeoreferenceAnnotationByUrl(
        "/iiif/annotation-page/2024/Wassaw_Sound",
      );
      console.log(
        "🚀 ~ map.on ~ warpedMapLayer2:",
        map,
        warpedMapLayer,
        warpedMapLayer2,
      );
    });
  }, [map, setMapLoaded]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className={`h-[calc(100vh-${topBarHeight})]`}
      ></div>
      <MapSwitcher map={map} />
    </div>
  );
};

export default Map;
