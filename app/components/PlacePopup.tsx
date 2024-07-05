import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { renderToString } from 'react-dom/server';
import type { TCoreDataPlaceRecord } from '~/types';

interface PlacePopupProps {
  place: TCoreDataPlaceRecord;
  map: maplibregl.Map;
  onClose: () => void;
}

const PlacePopup = ({ place, map, onClose }: PlacePopupProps) => {
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    console.log("PlacePopup effect triggered", place, map);
    if (!place || !map) return;

    const coordinates: [number, number] = place.place_geometry.geometry_json.coordinates;
    console.log("Coordinates", coordinates);

    const popupContent = renderToString(
      <>
        <h4 className="text-xl">{place.name}</h4>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: place.description || 'No description available',
          }}
        />
      </>
    );
    console.log("Popup content", popupContent);

    popupRef.current = new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map)
      .on('close', onClose);

    console.log("Popup added to map");

    map.flyTo({
      center: coordinates,
      zoom: 14,
      essential: true,
    });

    return () => {
      console.log("Cleanup: removing popup");
      popupRef.current?.remove();
    };
  }, [place, map, onClose]);

  return null;
};

export default PlacePopup;
