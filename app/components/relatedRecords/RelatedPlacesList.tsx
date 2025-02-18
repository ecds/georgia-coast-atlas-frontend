import { useContext, useEffect, useState } from "react";
import { indexCollection } from "~/config.ts";
import { fetchBySlug } from "~/data/coredata";
import type { Dispatch, SetStateAction } from "react";
import type { ESRelatedPlace } from "~/esTypes";
import { PlaceContext } from "~/contexts";

interface Props {
  otherPlaces?: ESRelatedPlace[];
  setOtherPlaces?: Dispatch<SetStateAction<ESRelatedPlace[]>>;
}

const RelatedPlacesList = ({ otherPlaces, setOtherPlaces }: Props) => {
  const { place, activePlace, setHoveredPlace, hoveredPlace, setActivePlace } =
    useContext(PlaceContext);
  const [allPlaces, setAllPlaces] = useState<ESRelatedPlace[]>(place.places);
  const [loading, setLoading] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const loadMorePlaces = async () => {
    if (hasLoadedMore || !setOtherPlaces) return;
    setLoading(true);

    try {
      const fetchedPlace = await fetchBySlug(place.slug, indexCollection);
      if (fetchedPlace?.other_places?.length > 0) {
        setOtherPlaces((prev) => [...prev, ...fetchedPlace.other_places]);
        setHasLoadedMore(true);
      }
    } catch (error) {
      console.error("Error loading more places:", error);
    } finally {
      setLoading(false);
    }
  };

  const unloadMorePlaces = () => {
    if (!setOtherPlaces) return;
    setOtherPlaces([]);
    setHasLoadedMore(false);
  };

  useEffect(() => {
    if (otherPlaces && otherPlaces.length > 0) {
      setAllPlaces([...place.places, ...otherPlaces]);
    } else {
      setAllPlaces(place.places);
    }
  }, [otherPlaces, place]);

  if (allPlaces?.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {allPlaces.map((relatedPlace) => {
            return (
              <div
                key={`related-place-list-${relatedPlace.uuid}`}
                onMouseEnter={() => setHoveredPlace(relatedPlace)}
                onMouseLeave={() => setHoveredPlace(undefined)}
              >
                <button
                  className={`text-black/75 text-left md:py-1 ${
                    hoveredPlace?.uuid === relatedPlace.uuid
                      ? "bg-gray-200 font-bold"
                      : ""
                  } ${activePlace === relatedPlace ? "underline font-bold" : ""}`}
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

        <>
          {!hasLoadedMore && (
            <button
              onClick={loadMorePlaces}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}

          {hasLoadedMore && (
            <button
              onClick={unloadMorePlaces}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              Show Less
            </button>
          )}
        </>
      </>
    );
  }

  return null;
};

export default RelatedPlacesList;
