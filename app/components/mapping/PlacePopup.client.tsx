import maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "react-router";
import { createPortal } from "react-dom";
import { MapContext } from "~/contexts";
import type { ReactNode } from "react";
import type { Popup, LngLatBounds, PositionAnchor } from "maplibre-gl";

interface Props {
  location: { lat: number; lon: number };
  onClose?: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  anchor?: PositionAnchor;
}
interface PopupProps extends Props {
  show: boolean;
  zoomToFeature?: boolean;
}

const PopupContent = ({ onClose, children, showCloseButton = true }: Props) => {
  return (
    <div className="flex flex-col">
      {showCloseButton && (
        <div className="flex justify-end">
          <button
            // className="maplibregl-popup-close-button"
            type="button"
            aria-label="Close popup"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      )}
      {children}
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
  anchor,
}: PopupProps) => {
  const popupRef = useRef<Popup | null>(null);
  const previousBounds = useRef<LngLatBounds | undefined>(undefined);
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
      if (onClose) onClose();
    }
  }, [navigation, onClose]);

  useEffect(() => {
    if (!map) return;
    if (location) setCoordinates([location.lon, location.lat]);
  }, [map, location]);

  useEffect(() => {
    if (coordinates && show && map) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        className: "pointer-events-auto place-popup",
        anchor,
        offset: 5,
        maxWidth: "33%",
      })
        .setLngLat(coordinates)
        .setDOMContent(popContainerRef.current)
        .on("close", onClose || (() => {}));

      popupRef.current?.addTo(map);
      if (zoomToFeature) {
        previousBounds.current = map.getBounds();
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
  }, [show, map, coordinates, zoomToFeature, onClose, anchor]);

  useEffect(() => {
    // Zoom out to previous bounds only if previous bounds are larger than bounds
    // when zoomed into active feature. This could maybe be accomplished by comparing
    // zoom levels ¯\_(ツ)_/¯
    if (
      zoomToFeature &&
      previousBounds.current &&
      !show &&
      map &&
      !map.getBounds().contains(previousBounds.current.getSouthEast())
    ) {
      map.fitBounds(previousBounds.current);
      previousBounds.current = undefined;
    }
  }, [zoomToFeature, show, map]);

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
