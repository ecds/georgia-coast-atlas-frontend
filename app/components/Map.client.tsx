import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import style from "~/data/style.json";
import { topBarHeight } from "~/config";
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
    // Add all the layers here
    // Google Satellite
    _map.addSource('google-satellite', {
      type: 'raster',
      tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
      tileSize: 256,
      attribution: '© Google',
    });
    _map.addLayer({
      id: 'google-satellite-layer',
      type: 'raster',
      source: 'google-satellite',
      layout: { visibility: 'none' }
    });

    // USGS Topo
    _map.addSource('usgs-topo', {
      type: 'raster',
      tiles: ['https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=0&styles=default'],
      tileSize: 256,
      attribution: '© USGS',
    });
    _map.addLayer({
      id: 'usgs-topo-layer',
      type: 'raster',
      source: 'usgs-topo',
      layout: { visibility: 'none' }
    });

    // ATLMaps
    _map.addSource('atlmaps', {
      type: 'raster',
      tiles: ['https://geoserver.ecds.emory.edu/ATLMaps/gwc/service/wms?layers=ATLMaps:r9jps&service=WMS&request=GetMap&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}'],
      tileSize: 256,
      attribution: '© ATLMaps',
    });
    _map.addLayer({
      id: 'atlmaps-layer',
      type: 'raster',
      source: 'atlmaps',
      layout: { visibility: 'none' }
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