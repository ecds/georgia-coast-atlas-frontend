import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
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
  const popupContentRef = useRef<HTMLDivElement>();
  const coordinates = useRef<[number, number] | undefined>();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading" && popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, [navigation]);

  useEffect(() => {
    if (!map || !place.place_geometry || !place.place_geometry.geometry_json)
      return;

    switch (place.place_geometry.geometry_json.type) {
      case "GeometryCollection":
        coordinates.current =
          place.place_geometry.geometry_json.geometries.find(
            (geom) => geom.type === "Point"
          )?.coordinates as [number, number];
        break;

      default:
        coordinates.current = place.place_geometry.geometry_json
          .coordinates as [number, number];
        break;
    }

    if (!coordinates.current || coordinates.current.length !== 2) return;

    if (popupRef.current) {
      popupRef.current.remove();
    }

    popupContentRef.current = document.createElement("div");

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      className: "pointer-events-auto",
    })
      .setLngLat(coordinates.current)
      .setDOMContent(popupContentRef.current);

    if (show) {
      popupRef.current.addTo(map);
      if (zoomToFeature) {
        map.flyTo({ center: coordinates.current, zoom: 15 });
      }
    }

    return () => {
      try {
        popupRef.current?.remove();
        popupRef.current = null;
      } catch {}
    };
  }, [map, place, show, zoomToFeature]);

  if (map && popupContentRef.current) {
    return createPortal(
      <PopupContent place={place} onClose={onClose} />,
      popupContentRef.current
    );
  }

  return null;
};

export default PlacePopup;
