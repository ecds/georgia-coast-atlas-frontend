import { useContext, useEffect, useState } from "react";
import { PlaceContext } from "~/contexts";
import type { Dispatch, SetStateAction } from "react";
import type { ESRelatedPlace } from "~/esTypes";

interface Props {
  showAllPlaces?: boolean;
  setShowAllPlaces?: Dispatch<SetStateAction<boolean>>;
}

const RelatedPlacesList = ({
  showAllPlaces = false,
  setShowAllPlaces,
}: Props) => {
  const {
    place,
    activePlace,
    setHoveredPlace,
    hoveredPlace,
    setActivePlace,
    setNoTrackMouse,
  } = useContext(PlaceContext);

  const [allPlaces, setAllPlaces] = useState<ESRelatedPlace[]>(
    place?.places ?? []
  );

  const handleMouseEnter = (place: ESRelatedPlace) => {
    setActivePlace(undefined);
    setHoveredPlace(place);
    if (setNoTrackMouse) setNoTrackMouse(true);
  };

  const handleMouseLeave = () => {
    setHoveredPlace(undefined);
    if (setNoTrackMouse) setNoTrackMouse(false);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2">
          {allPlaces.map((relatedPlace) => {
            return (
              <div key={`related-place-list-${relatedPlace.uuid}`}>
                <button
                  className={`text-black/75 text-left md:py-1 ${
                    hoveredPlace?.uuid === relatedPlace.uuid
                      ? "bg-gray-200 font-bold"
                      : ""
                  } ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
                  onMouseEnter={() => handleMouseEnter(relatedPlace)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    setActivePlace(relatedPlace);
                  }}
                >
                  {relatedPlace.name}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mb-8">
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
        </div>
      </>
    );
  }

  return null;
};

export default RelatedPlacesList;
