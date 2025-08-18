import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
  const { place, activePlace, setActivePlace } = useContext(PlaceContext);

  const [allPlaces, setAllPlaces] = useState<ESRelatedPlace[]>(
    place?.places ?? []
  );

  const navigate = useNavigate();

  const handleMouseEnter = (place: ESRelatedPlace) => {
    setActivePlace(place);
  };

  const handleMouseLeave = () => {
    setActivePlace(undefined);
  };

  const handleClick = (clickedPlace: ESRelatedPlace) => {
    if (!place) return;
    setActivePlace(undefined);
    navigate(`/places/${clickedPlace.slug}`, {
      state: {
        title: place.name,
        slug: place.slug,
        previous: `/places/${place.slug}`,
      },
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allPlaces.map((relatedPlace) => {
            return (
              <div key={`related-place-list-${relatedPlace.uuid}`}>
                <button
                  className={`text-black/75 text-left md:py-1 ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
                  onMouseMove={() => handleMouseEnter(relatedPlace)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    handleClick(relatedPlace);
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
