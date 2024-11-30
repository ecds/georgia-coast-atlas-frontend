import maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@remix-run/react";
import { createPortal } from "react-dom";
import { MapContext } from "~/contexts";
import type { ReactNode } from "react";
import type { Popup } from "maplibre-gl";

interface Props {
  location: { lat: number; lon: number };
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}
interface PopupProps extends Props {
  show: boolean;
  zoomToFeature?: boolean;
}

const PopupContent = ({ onClose, children, showCloseButton = true }: Props) => {
  return (
    <div>
      {children}
      {showCloseButton && (
        <button
          className="maplibregl-popup-close-button"
          type="button"
          aria-label="Close popup"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      )}
    </div>
  );
};

const PlacePopup = ({
  location,
  show,
  onClose,
  zoomToFeature = true,
  children,
  showCloseButton = true,
}: PopupProps) => {
  const popupRef = useRef<Popup | null>(null);
  const { map } = useContext(MapContext);

  const [coordinates, setCoordinates] = useState<
    [number, number] | undefined
  >();
  const popContainerRef = useRef<HTMLDivElement>(document.createElement("div"));

  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading" && popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
      onClose();
    }
  }, [navigation, onClose]);

  useEffect(() => {
    if (!map) return;
    if (location) setCoordinates([location.lon, location.lat]);
  }, [map, location]);

  useEffect(() => {
    if (popContainerRef.current && coordinates && show && map) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        className: "pointer-events-auto",
      })
        .setLngLat(coordinates)
        .setDOMContent(popContainerRef.current);

      popupRef.current?.addTo(map);
      if (zoomToFeature) {
        map.flyTo({ center: coordinates, zoom: 15 });
      }
    }

    if (!show) {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    }

    return () => {
      if (popupRef.current) popupRef.current.remove();
    };
  }, [show, map, coordinates, zoomToFeature, onClose]);

  useEffect(() => {
    if (!map || !popupRef.current || !show) return;
    // Detect clicks outside the popup and close it
    const handleOutsideClick = (e: MouseEvent) => {
      const popupEl = popupRef.current?._container;

      if (popupEl && !popupEl.contains(e.target as Node) && map.getCanvas().contains(e.target as Node)) {
        onClose();

        if (coordinates) {
          map.flyTo({ center: coordinates, zoom: 15 });
        }
      }
    };

    map.getCanvas().addEventListener("click", handleOutsideClick);

    return () => {
      map.getCanvas().removeEventListener("click", handleOutsideClick);
    };
  }, [map, show, coordinates, onClose]);
  
  if (map && popContainerRef.current) {
    return (
      <>
        {createPortal(
          <PopupContent
            location={location}
            onClose={onClose}
            showCloseButton={showCloseButton}
          >
            {children}
          </PopupContent>,
          popContainerRef.current
        )}
      </>
    );
  }

  return null;
};

export default PlacePopup;
