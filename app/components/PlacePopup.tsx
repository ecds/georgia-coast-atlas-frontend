import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import type { Popup } from "maplibre-gl";
import type { TPlaceRecord } from "~/types";

interface PopupProps {
  map: maplibregl.Map | undefined;
  place: TPlaceRecord;
  show: boolean;
  onClose: () => void;
}

const PlacePopup = ({ map, place, show, onClose }: PopupProps) => {
  const popupRef = useRef<Popup | undefined>(undefined);
  const popupContentRef = useRef<HTMLDivElement>(null);
  const coordinates = useRef<[number, number] | undefined>();

  const handleClick = () => {
    onClose();
    popupRef.current?.remove();
  };

  useEffect(() => {
    if (!map) return;

    if (!place.place_geometry || !place.place_geometry.geometry_json) return;

    coordinates.current = place.place_geometry.geometry_json.coordinates as [
      number,
      number,
    ];
    if (!coordinates.current || coordinates.current.length !== 2) return;

    if (popupRef.current) {
      popupRef.current.remove();
    }

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      className: "pointer-events-auto",
    })
      .setLngLat(coordinates.current)
      .setDOMContent(popupContentRef.current as Node);

    return () => {
      popupRef.current?.remove();
      popupRef.current = undefined;
    };
  }, [map, place]);

  useEffect(() => {
    if (show && map) {
      popupRef.current?.addTo(map);
      map.flyTo({ center: coordinates.current, zoom: 15 });
    } else {
      popupRef.current?.remove();
    }
  }, [show, map]);

  return (
    <div ref={popupContentRef}>
      <h4 className="text-xl">{place.name}</h4>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: place.description ?? "No description available",
        }}
      />
      <button
        className="maplibregl-popup-close-button"
        type="button"
        aria-label="Close popup"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>{" "}
    </div>
  );
};

export default PlacePopup;
