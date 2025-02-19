import { useContext, useEffect } from "react";
import { PlaceContext } from "~/contexts";
import type { ESRelatedPlace } from "~/esTypes";

const RelatedPlacesDetailedList = () => {
  const {
    place,
    activePlace,
    setHoveredPlace,
    hoveredPlace,
    setActivePlace,
    setNoTrackMouse,
  } = useContext(PlaceContext);

  const handleMouseEnter = (place: ESRelatedPlace) => {
    setHoveredPlace(place);
    if (setNoTrackMouse) setNoTrackMouse(true);
  };

  const handleMouseLeave = () => {
    setHoveredPlace(undefined);
    if (setNoTrackMouse) setNoTrackMouse(false);
  };

  useEffect(() => {
    if (!activePlace) return;
    const element = document.getElementById(`place-${activePlace.uuid}`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [activePlace]);

  if (place.places.length > 0) {
    return (
      <section className="h-[600px] overflow-hidden">
        <ul className="h-full overflow-auto relative">
          {place.places.map((relatedPlace) => {
            return (
              <li
                id={`place-${relatedPlace.uuid}`}
                className=" flex flex-col border-b border-2"
                key={`related-place-list-${relatedPlace.uuid}`}
              >
                <button
                  className={`text-black/75 text-left md:py-1 ${
                    hoveredPlace?.uuid === relatedPlace.uuid
                      ? "bg-gray-100"
                      : ""
                  } ${activePlace === relatedPlace ? "" : ""}`}
                  onMouseEnter={() => handleMouseEnter(relatedPlace)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    setActivePlace(relatedPlace);
                  }}
                >
                  <article className="p-4 w-full">
                    <img
                      src={
                        place.featured_photograph ??
                        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
                      }
                      className="max-w-48 max-h-48 mx-auto mb-4"
                      alt=""
                    />
                    <h2 className="text-xl font-semibold">
                      {relatedPlace.name}
                    </h2>
                    <div
                      className="my-2"
                      dangerouslySetInnerHTML={{
                        __html: relatedPlace.description ?? "",
                      }}
                    />
                    <a
                      className="text-blue-500 visited:text-blue-800 underline"
                      href={`/places/${relatedPlace.slug}`}
                    >
                      Read More...
                    </a>
                  </article>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return null;
};

export default RelatedPlacesDetailedList;
