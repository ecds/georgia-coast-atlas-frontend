import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { MapContext, PlaceContext } from "~/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import {
  baseWithLabels,
  satelliteWithLabels,
  usgsWithLabels,
} from "~/mapStyles";

import type { ReactNode } from "react";
import { orderLayers } from "~/utils/orderMaps";
import type { StyleSpecification } from "maplibre-gl";

const MapSwitcher = ({ children }: { children?: ReactNode }) => {
  const { map } = useContext(MapContext);
  const { place, layerSources, activeLayers } = useContext(PlaceContext);
  const [activeStyle, setActiveStyle] =
    useState<StyleSpecification>(baseWithLabels);

  const addLayers = useCallback(() => {
    if (!map) return;

    if (layerSources) {
      for (const source of Object.keys(layerSources)) {
        if (!map.getSource(source)) map.addSource(source, layerSources[source]);
      }
    }

    if (activeLayers) {
      for (const layer of activeLayers) {
        if (!map.getLayer(layer.id)) map.addLayer(layer);
      }
    }

    if (activeLayers) {
      for (const layer of activeLayers) {
        if (!map.getLayer(layer.id)) map.addLayer(layer);
      }
    }

    orderLayers(map, place.id, activeLayers, "switcher");
    if (map.getLayer(activeStyle.layers[activeStyle.layers.length - 1].id)) {
      // Remove the listener so it will not run again until another layer is selected.
      map.off("idle", addLayers);
    }
  }, [map, place, layerSources, activeStyle, activeLayers]);

  useEffect(() => {
    if (!map) return;
    // When the style is updated, all the other layers are removed.
    // We use this listener to wait until the style has changed
    // before re-adding all the layers.

    if (map.getStyle().name !== activeStyle.name) {
      map.once("idle", addLayers);
      map.setStyle(activeStyle);
    }
  }, [map, addLayers, activeStyle]);

  // Use a standalone function to make sure it only updates when layer is explicitly selected.
  const handleClick = (layer: StyleSpecification) => {
    setActiveStyle(layer);
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
        unmount={false}
      >
        <span className="px-4 mt-2">Base Maps</span>
        {[baseWithLabels, satelliteWithLabels, usgsWithLabels].map((layer) => (
          <button
            key={layer?.name?.replace(" ", "")}
            onClick={() => handleClick(layer)}
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${activeStyle?.name === layer.name ? "bg-gray-200" : ""}`}
            role="menuitem"
          >
            {layer.name}
          </button>
        ))}
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default MapSwitcher;
