import { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import maplibregl, { Popup } from "maplibre-gl";
import type { TCoreDataPlaceRecord } from "~/types";

interface PopupComponentProps {
  map: maplibregl.Map | undefined;
  activePlace: TCoreDataPlaceRecord | undefined;
  onClose: () => void;
}

const PopupComponent = ({ map, activePlace, onClose }: PopupComponentProps) => {
  const popupRef = useRef<Popup | undefined>(undefined);

  useEffect(() => {
    if (!map || !activePlace || !activePlace.location?.coordinates) return;

    const coordinates = activePlace.location.coordinates as [number, number];
    const description = activePlace.description || "No description available";

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
        )
      )
      .addTo(map)
      .on("close", onClose);

    return () => {
      popupRef.current?.remove();
    };
  }, [map, activePlace, onClose]);

  return null;
};

export default PopupComponent;
