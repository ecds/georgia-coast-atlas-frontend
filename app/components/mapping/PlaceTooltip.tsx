import maplibregl from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@remix-run/react";
import { createPortal } from "react-dom";
import { MapContext } from "~/contexts";
import type { ReactNode } from "react";
import type { Popup, PositionAnchor } from "maplibre-gl";

interface Props {
  location: { lat: number; lon: number };
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}

interface PopupProps extends Props {
  show: boolean;
  zoomToFeature?: boolean;
  anchor: PositionAnchor;
}

const TooltipContent = ({ onClose, children }: Props) => {
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
        className: "tooltip",
        offset: 20,
        anchor,
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
  }, [show, map, coordinates, zoomToFeature, onClose, anchor]);

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
