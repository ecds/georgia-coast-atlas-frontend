import maplibregl from "maplibre-gl";
import { useEffect, useState, useRef } from "react";
import style from "~/data/style.json";
import { topBarHeight } from "~/config";
import "maplibre-gl/dist/maplibre-gl.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import type { Dispatch, SetStateAction } from "react";
import type { StyleSpecification } from "maplibre-gl";

interface Props {
  map: maplibregl.Map | undefined;
  setMap: Dispatch<SetStateAction<maplibregl.Map | undefined>>;
  setMapLoaded: Dispatch<SetStateAction<boolean>>;
}

const Map = ({ map, setMap, setMapLoaded }: Props) => {
  const [activeLayer, setActiveLayer] = useState<string>("custom");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        layout: {
          visibility: 'none'
        }
      });

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
        layout: {
          visibility: 'none'
        }
      });

      // The ATLMaps Layer (I've added it for reference on example for our geoserver)
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
        layout: {
          visibility: 'none'
        }
      });

      setMap(_map);
      setMapLoaded(true);
    });

    return () => {
      if (_map) _map.remove();
      setMap(undefined);
      setMapLoaded(false);
    };
  }, [setMap, setMapLoaded]);

  const toggleLayer = (layerName: string) => {
    if (!map) return;

    const layers = ['google-satellite-layer', 'usgs-topo-layer', 'atlmaps-layer'];

    layers.forEach((layer) => {
      map.setLayoutProperty(layer, 'visibility', 'none');
    });

    if (layerName !== 'custom') {
      map.setLayoutProperty(`${layerName}-layer`, 'visibility', 'visible');
    }

    setActiveLayer(layerName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div ref={mapContainerRef} className={`h-[calc(100vh-${topBarHeight})]`}></div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          <FontAwesomeIcon icon={faLayerGroup} />
          <span className="sr-only">Toggle layer menu</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button
                onClick={() => toggleLayer('custom')}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === 'custom' ? 'bg-gray-200' : ''}`}
                role="menuitem"
              >
                Default Layer
              </button>
              <button
                onClick={() => toggleLayer('google-satellite')}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === 'google-satellite' ? 'bg-gray-200' : ''}`}
                role="menuitem"
              >
                Satellite Layer
              </button>
              <button
                onClick={() => toggleLayer('usgs-topo')}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === 'usgs-topo' ? 'bg-gray-200' : ''}`}
                role="menuitem"
              >
                USGS Topo Layer
              </button>
              <button
                onClick={() => toggleLayer('atlmaps')}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === 'atlmaps' ? 'bg-gray-200' : ''}`}
                role="menuitem"
              >
                ATLMaps Layer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
