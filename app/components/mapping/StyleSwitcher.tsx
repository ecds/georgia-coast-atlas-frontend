import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useContext, useEffect } from "react";
import { MapContext } from "~/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { mapLayers } from "~/config";
import { full } from "~/mapStyles/full";
import type { ReactNode } from "react";

const StyleSwitcher = ({ children }: { children?: ReactNode }) => {
  const { map, activeStyle, setActiveStyle } = useContext(MapContext);

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

  // "icon-halo-color": "black",
  //     "icon-opacity": 0.8,
  //     "text-color": color,
  //     "text-halo-blur": 1,
  //     "text-halo-color": [
  //       "interpolate",
  //       ["linear"],
  //       ["zoom"],
  //       3,
  //       "hsla(0, 0%, 0%, 0.85)",
  //       5,
  //       "hsla(0, 0%, 0%, 1.0)",

  useEffect(() => {
    if (!map) return;

    const layers = full.layers.filter(
      (layer) => layer.id.startsWith("gca-") && layer.type === "symbol"
    );

    if (activeStyle && ["satellite", "usgs"].includes(activeStyle)) {
      const currentZoom = map.getZoom();
      if (currentZoom > 15.5) map.setZoom(15.5);
      map.setMaxZoom(15.5);
      for (const layer of layers) {
        map.setPaintProperty(layer.id, "text-color", "hsl(0, 0%, 100%)");
        map.setPaintProperty(layer.id, "text-halo-width", 1);
        map.setPaintProperty(layer.id, "text-halo-color", [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          "hsla(0, 2%, 16%, 0.85)",
          5,
          "hsla(0, 2%, 16%, 1.0)",
        ]);
      }
    } else {
      map.setMaxZoom(22);
      for (const layer of layers) {
        map.setPaintProperty(layer.id, "text-color", "hsl(0, 2%, 16%)");
        map.setPaintProperty(layer.id, "text-halo-width", 1.5);
        map.setPaintProperty(layer.id, "text-halo-color", [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          "hsla(0, 0%, 100%, 0.85)",
          5,
          "hsla(0, 0%, 100%, 1.0)",
        ]);
      }
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
        <button
          onClick={() => setActiveStyle(undefined)}
          role="menuitem"
          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${!activeStyle ? "bg-gray-200" : ""}`}
        >
          Default
        </button>
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
