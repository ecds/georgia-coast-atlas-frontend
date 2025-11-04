import { Marker } from "maplibre-gl";
import { useContext, useEffect, useRef } from "react";
import { MapContext, PlaceContext } from "~/contexts";

const PlacePreview = () => {
  const { hoveredPlace } = useContext(PlaceContext);
  const { map } = useContext(MapContext);
  const markerRef = useRef<Marker>();
  const previewPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    if (hoveredPlace && previewPanelRef.current) {
      markerRef.current = new Marker({
        anchor: "bottom",
        element: previewPanelRef.current,
      })
        .setLngLat([hoveredPlace.location.lon, hoveredPlace.location.lat])
        .addTo(map);
    } else {
      markerRef.current?.remove();
    }

    return () => {
      markerRef.current?.remove();
    };
  }, [hoveredPlace, map]);

  return (
    <div
      ref={previewPanelRef}
      className="bg-white w-32 md:w-64 rounded-md drop-shadow-lg"
    >
      {hoveredPlace?.featured_photograph && (
        <img
          src={hoveredPlace.featured_photograph.replace("max", "768,")}
          alt=""
          className="w-full h-24 object-cover"
        />
      )}
      <h4 className="text-xl mt-1 px-2">{hoveredPlace?.name}</h4>
      <div
        className="tracking-loose my-1 max-h-16 truncate preview p-2"
        dangerouslySetInnerHTML={{
          __html: hoveredPlace?.description ?? "",
        }}
      />
    </div>
  );
};

export default PlacePreview;
