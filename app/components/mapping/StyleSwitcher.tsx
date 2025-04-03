import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "~/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { mapLayers } from "~/config";
import type { ReactNode } from "react";
import type { TBaseStyleName } from "~/types";

const StyleSwitcher = ({ children }: { children?: ReactNode }) => {
  const { map } = useContext(MapContext);
  const [activeStyle, setActiveStyle] = useState<TBaseStyleName>("default");

  useEffect(() => {
    if (!map) return;
    for (const style of mapLayers) {
      if (activeStyle === style.name) {
        style.layers.forEach((layer) =>
          map.setLayoutProperty(layer, "visibility", "visible")
        );
      } else {
        style.layers.forEach((layer) =>
          map.setLayoutProperty(layer, "visibility", "none")
        );
      }
    }
  }, [map, activeStyle]);

  useEffect(() => {
    if (!map) return;
    if (activeStyle === "satellite") {
      const currentZoom = map.getZoom();
      if (currentZoom > 15.5) map.setZoom(15.5);
      map.setMaxZoom(15.5);
    } else {
      map.setMaxZoom(22);
    }
  }, [map, activeStyle]);

  return (
    <Popover>
      <PopoverButton className="flex items-center gap-2 absolute top-4 right-4 bg-white p-4 rounded-full shadow-md">
        <FontAwesomeIcon icon={faLayerGroup} />
        <span className="sr-only">Toggle layer menu</span>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="group-data-[open]:flex flex-col mt-2 -ml-4 pb-2 min-w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        unmount={false}
      >
        <span className="px-4 mt-2">Base Maps</span>
        {mapLayers.map((layer) => (
          <button
            key={layer?.name?.replace(" ", "")}
            onClick={() => setActiveStyle(layer.name)}
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeStyle === layer.name ? "bg-gray-200" : ""}`}
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

export default StyleSwitcher;
