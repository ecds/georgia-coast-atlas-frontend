import { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import maplibregl, { Popup } from "maplibre-gl";
import type { TCoreDataPlaceRecord } from "~/types";

interface PopupProps {
  map: maplibregl.Map | undefined;
  activePlace: TCoreDataPlaceRecord | undefined;
  onClose: () => void;
}

const PlacePopup = ({ map, activePlace, onClose }: PopupProps) => {
  const popupRef = useRef<Popup | undefined>(undefined);

  useEffect(() => {
    if (!map || !activePlace) return;

    if (!activePlace.place_geometry || !activePlace.place_geometry.geometry_json) return;

    const coordinates = activePlace.place_geometry.geometry_json.coordinates as [number, number];
    if (!coordinates || coordinates.length !== 2) return;

    const description = activePlace.description || "No description available";

    if (popupRef.current) {
      popupRef.current.remove();
    }

    popupRef.current = new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(
        renderToString(
          <>
            <h4 className="text-xl">{activePlace.name}</h4>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </>,
        ),
      )
      .addTo(map)
      .on("close", onClose);

    map.flyTo({ center: coordinates, zoom: 15 });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, activePlace, onClose]);

  return null;
};

export default PlacePopup;
