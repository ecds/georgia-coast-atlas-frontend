import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import type { Map } from "maplibre-gl";

interface Props {
  map: Map | undefined;
}

const MapSwitcher = ({ map }: Props) => {
  const [activeLayer, setActiveLayer] = useState<string>("custom");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  );
};

export default MapSwitcher;