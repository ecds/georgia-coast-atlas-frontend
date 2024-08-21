import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { mapLayers } from "~/config";
import type { Map } from "maplibre-gl";

interface Props {
  map: Map | undefined;
}

const MapSwitcher = ({ map }: Props) => {
  const [activeLayer, setActiveLayer] = useState<string>("custom");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleLayer = (layerName: string) => {
    if (!map) return;

    const layerIds = mapLayers.map((layer) => `${layer.id}-layer`);

    layerIds.forEach((layer) => {
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
            {mapLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === layer.id ? 'bg-gray-200' : ''}`}
                role="menuitem"
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSwitcher;