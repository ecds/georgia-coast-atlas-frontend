import { Popup } from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MapContext, PlaceContext } from "~/contexts";

const PopupContent = () => {
  const { hoveredPlace } = useContext(PlaceContext);

  return (
    <>
      {hoveredPlace?.featured_photograph && (
        <img
          src={hoveredPlace.featured_photograph.replace("max", "768,")}
          alt=""
          className="w-full h-24 object-cover"
        />
      )}
      <h4 className="mt-1 px-2 text-lg">{hoveredPlace?.name}</h4>
      <div
        className="tracking-loose my-1 max-h-16 md:max-w-64 truncate px-2 text-xs"
        dangerouslySetInnerHTML={{
          __html: hoveredPlace?.description ?? "",
        }}
      />
    </>
  );
};

const PlacePreview = () => {
  const { map } = useContext(MapContext);
  const { hoveredPlace } = useContext(PlaceContext);
  const popupRef = useRef<Popup | null>(null);
  const popContainerRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (!map) return;

    if (hoveredPlace && popContainerRef.current) {
      popupRef.current = new Popup({
        closeButton: false,
        className: "min-w-32 md:max-w-64 rounded-md drop-shadow-lg preview",
      })
        .setLngLat([hoveredPlace.location.lon, hoveredPlace.location.lat])
        .setDOMContent(popContainerRef.current);

      // map.fitBounds(
      //   map
      //     .getBounds()
      //     .extend([hoveredPlace.location.lon, hoveredPlace.location.lat])
      // );

      if (
        hoveredPlace.featured_photograph ||
        hoveredPlace.description ||
        map.getZoom() < 12
      )
        popupRef.current.addTo(map);
    } else {
      popupRef.current?.remove();
    }

    return () => {
      popupRef.current?.remove();
    };
  }, [hoveredPlace, map]);

  if (map && popContainerRef.current && hoveredPlace) {
    return <>{createPortal(<PopupContent />, popContainerRef.current)}</>;
  }

  return <></>;
};

export default PlacePreview;
