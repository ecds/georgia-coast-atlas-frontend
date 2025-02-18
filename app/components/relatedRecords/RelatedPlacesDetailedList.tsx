import { useContext } from "react";
import { PlaceContext } from "~/contexts";

const RelatedPlacesDetailedList = () => {
  const { place, activePlace, setHoveredPlace, hoveredPlace, setActivePlace } =
    useContext(PlaceContext);

  console.log("🚀 ~ RelatedPlacesDetailedList ~ place.places:", place.places);
  if (place.places.length > 0) {
    return (
      <ul className="">
        {place.places.map((relatedPlace) => {
          return (
            <li
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
                <h2>{relatedPlace.name}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: relatedPlace.description ?? "",
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
};

export default RelatedPlacesDetailedList;
