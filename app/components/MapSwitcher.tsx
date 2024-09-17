import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useContext, useState } from "react";
import { MapContext } from "~/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { mapLayers } from "~/config";
import type { ReactNode } from "react";

const MapSwitcher = ({ children }: { children?: ReactNode }) => {
  const { map } = useContext(MapContext);
  const [activeLayer, setActiveLayer] = useState<string>("custom");

  const toggleLayer = (layerName: string) => {
    if (!map) return;

    const layerIds = mapLayers.map((layer) => `${layer.id}-layer`);

    layerIds.forEach((layer) => {
      map.setLayoutProperty(layer, "visibility", "none");
    });

    if (layerName !== "custom") {
      map.setLayoutProperty(`${layerName}-layer`, "visibility", "visible");
    }

    setActiveLayer(layerName);
  };

  return (
    <Popover>
      <PopoverButton className="flex items-center gap-2 absolute top-4 right-4 bg-white p-4 rounded-full shadow-md">
        <FontAwesomeIcon icon={faLayerGroup} />
        <span className="sr-only">Toggle layer menu</span>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="flex flex-col mt-2 -ml-4 pb-2 min-w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
      >
        <span className="px-4 mt-2">Base Maps</span>
        {mapLayers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeLayer === layer.id ? "bg-gray-200" : ""}`}
            role="menuitem"
          >
            {layer.label}
          </button>
        ))}
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default MapSwitcher;
