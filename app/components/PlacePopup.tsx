import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import type { Popup } from "maplibre-gl";
import type { TPlaceRecord, TRelatedPlaceRecord } from "~/types";
import { useNavigation } from "@remix-run/react";
import { createPortal } from "react-dom";

interface Props {
  place: TPlaceRecord | TRelatedPlaceRecord;
  onClose: () => void;
}
interface PopupProps extends Props {
  map: maplibregl.Map | undefined;
  show: boolean;
  zoomToFeature?: boolean;
}

const PopupContent = ({ place, onClose }: Props) => {
  return (
    <div>
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
        id={`close-${place.uuid}`}
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

const PlacePopup = ({
  map,
  place,
  show,
  onClose,
  zoomToFeature = true,
}: PopupProps) => {
  const popupRef = useRef<Popup | null>(null);

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
    if (!map || !place.place_geometry || !place.place_geometry.geometry_json)
      return;

    switch (place.place_geometry.geometry_json.type) {
      case "GeometryCollection":
        setCoordinates(
          place.place_geometry.geometry_json.geometries.find(
            (geom) => geom.type === "Point"
          )?.coordinates as [number, number]
        );
        break;
      default:
        setCoordinates(
          place.place_geometry.geometry_json.coordinates as [number, number]
        );
        break;
    }
  }, [map, place]);

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
  }, [show, map, coordinates, zoomToFeature, onClose]);

  if (map && popContainerRef.current) {
    return (
      <>
        {createPortal(
          <PopupContent place={place} onClose={onClose} />,
          popContainerRef.current
        )}
      </>
    );
  }

  return null;
};

export default PlacePopup;
