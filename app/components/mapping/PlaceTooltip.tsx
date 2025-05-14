import { Popup } from "maplibre-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import { createPortal } from "react-dom";
import { MapContext, PlaceContext } from "~/contexts";
import type { ReactNode } from "react";
import type { PositionAnchor } from "maplibre-gl";
import type { TLonLat } from "~/esTypes";

interface PopupProps {
  anchor?: PositionAnchor;
  children: ReactNode;
  className?: string;
  location: TLonLat;
  onClose: () => void;
  show: boolean;
  zoomToFeature?: boolean;
}

const PlaceTooltip = ({
  anchor,
  children,
  className,
  location,
  onClose,
  show,
  zoomToFeature = true,
}: PopupProps) => {
  const popupRef = useRef<Popup | null>(null);
  const { map } = useContext(MapContext);
  const { noTrackMouse } = useContext(PlaceContext);

  const [coordinates, setCoordinates] = useState<
    [number, number] | undefined
  >();
  // const [trackMouse, setTrackMouse] = useState();
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

    const enableMouseTracking = () => {
      if (popupRef.current) {
        popupRef.current.trackPointer();
      }
    };

    const remove = () => {
      popupRef.current?.remove();
    };
    map.on("mousemove", enableMouseTracking);
    map.on("mouseout", remove);

    return () => {
      map.off("mousemove", enableMouseTracking);
      map.off("mouseout", remove);
    };
  }, [map, location]);

  useEffect(() => {
    if (popContainerRef.current && coordinates && show && map) {
      if (coordinates.every((cord) => typeof cord !== "number")) return;
      popupRef.current = new Popup({
        closeButton: false,
        className: "tooltip",
        // offset: 20,
        anchor,
      })
        .setLngLat(coordinates)
        .setDOMContent(popContainerRef.current);
      // .trackPointer();

      // if (!noTrackMouse) {
      //   popupRef.current.trackPointer();
      // }

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
          <div className={className ?? "text-lg"}>{children}</div>,
          popContainerRef.current
        )}
      </>
    );
  }

  return null;
};

export default PlaceTooltip;
