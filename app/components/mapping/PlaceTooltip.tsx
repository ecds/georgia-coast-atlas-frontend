import { Popup } from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@remix-run/react";
import { createPortal } from "react-dom";
import { MapContext, PlaceContext } from "~/contexts";
import type { ReactNode } from "react";
import type { PositionAnchor } from "maplibre-gl";

interface Props {
  location: { lat: number; lon: number };
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}

interface PopupProps extends Props {
  show: boolean;
  zoomToFeature?: boolean;
  anchor?: PositionAnchor;
}

const TooltipContent = ({ children }: Props) => {
  return <div className="text-lg">{children}</div>;
};

const PlaceTooltip = ({
  location,
  show,
  onClose,
  zoomToFeature = true,
  children,
  showCloseButton = true,
  anchor,
}: PopupProps) => {
  const popupRef = useRef<Popup | null>(null);
  const { map } = useContext(MapContext);
  const { noTrackMouse } = useContext(PlaceContext);

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
      if (coordinates.every((cord) => typeof cord !== "number")) return;
      popupRef.current = new Popup({
        closeButton: false,
        className: "tooltip",
        offset: 20,
      })
        .setLngLat(coordinates)
        .setDOMContent(popContainerRef.current);
      // .trackPointer();

      if (!noTrackMouse) {
        popupRef.current.trackPointer();
      }

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
  }, [show, map, coordinates, zoomToFeature, onClose, anchor, noTrackMouse]);

  if (map && popContainerRef.current) {
    return (
      <>
        {createPortal(
          <TooltipContent
            location={location}
            onClose={onClose}
            showCloseButton={showCloseButton}
          >
            {children}
          </TooltipContent>,
          popContainerRef.current
        )}
      </>
    );
  }

  return null;
};

export default PlaceTooltip;
