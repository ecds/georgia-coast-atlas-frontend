import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PlaceContext } from "~/contexts";
import type { Dispatch, SetStateAction } from "react";
import type { ESRelatedPlace } from "~/esTypes";

interface Props {
  showAllPlaces?: boolean;
  setShowAllPlaces?: Dispatch<SetStateAction<boolean>>;
}

const RelatedPlacesList = ({ showAllPlaces = false }: Props) => {
  const { place, setHoveredPlace } = useContext(PlaceContext);
  const navigate = useNavigate();
  const [allPlaces, setAllPlaces] = useState<ESRelatedPlace[]>(
    place?.places ?? []
  );

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
    );
  }

  return null;
};

export default RelatedPlacesList;
