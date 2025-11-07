import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MapContext, PlaceContext } from "~/contexts";
import type { Dispatch, SetStateAction } from "react";
import type { ESRelatedPlace } from "~/esTypes";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import type { Marker } from "maplibre-gl";

interface Props {
  showAllPlaces?: boolean;
  setShowAllPlaces?: Dispatch<SetStateAction<boolean>>;
}

const RelatedPlacesList = ({
  showAllPlaces = false,
  setShowAllPlaces,
}: Props) => {
  const { place, setHoveredPlace } = useContext(PlaceContext);
  const { map } = useContext(MapContext);
  const navigate = useNavigate();
  const [allPlaces, setAllPlaces] = useState<ESRelatedPlace[]>(
    place?.places ?? []
  );
  const markerRef = useRef<Marker>();
  const markerElementRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!map || !markerElementRef.current) return;
  //   markerRef.current = new Marker({
  //     anchor: "bottom",
  //     element: markerElementRef.current,
  //   });
  // }, [map]);

  // useEffect(() => {
  //   if (!map || !markerRef.current) return;

  //   if (hoveredPlace) {
  //     markerRef.current
  //       .setLngLat([hoveredPlace.location.lon, hoveredPlace.location.lat])
  //       .addTo(map);
  //   } else {
  //     markerRef.current.remove();
  //   }

  //   return () => {
  //     markerRef.current?.remove();
  //   };
  // }, [map, hoveredPlace]);

  useEffect(() => {
    if (!place) return;
    if (showAllPlaces) {
      setAllPlaces([...place.places, ...place.other_places]);
    } else {
      setAllPlaces(place.places);
    }
  }, [showAllPlaces, place]);

  if (allPlaces?.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allPlaces.map((relatedPlace) => {
            return (
              <div key={`related-place-list-${relatedPlace.uuid}`}>
                <button
                  className={`text-black/75 text-left md:py-1 hover:underline hover:font-bold`}
                  role="link"
                  onClick={() => navigate(`/places/${relatedPlace.slug}`)}
                  onMouseEnter={() => {
                    if (setHoveredPlace) setHoveredPlace(relatedPlace);
                  }}
                  onMouseLeave={() => {
                    if (setHoveredPlace) setHoveredPlace(undefined);
                  }}
                >
                  {relatedPlace.name}
                </button>
              </div>
            );
          })}
        </div>
        {/* <div className="mb-8">
          {place && place.other_places.length > 0 && setShowAllPlaces && (
            <>
              <button
                onClick={() => setShowAllPlaces(!showAllPlaces)}
                className="mt-4 p-2 bg-island text-white rounded"
              >
                {showAllPlaces ? "Show Less" : "Show More"}
              </button>
            </>
          )}
        </div> */}
        {/* <div ref={markerElementRef} className="text-center">
          <p className="bg-black text-white rounded-md p-1">
            {hoveredPlace?.name}
          </p>
          <FontAwesomeIcon
            icon={faLocationDot}
            className="z-50 text-xl w-12 h-12 text-blue-500"
          />
        </div> */}
      </>
    );
  }

  return null;
};

export default RelatedPlacesList;
