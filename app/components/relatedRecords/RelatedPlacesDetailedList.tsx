import { useContext, useEffect } from "react";
import { PlaceContext } from "~/contexts";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";
import RelatedSection from "./RelatedSection";

const RelatedPlacesDetailedList = ({
  places,
}: {
  places: ESPlace[] | ESRelatedPlace[];
}) => {
  const {
    activePlace,
    setHoveredPlace,
    hoveredPlace,
    setActivePlace,
    setNoTrackMouse,
  } = useContext(PlaceContext);

  const handleMouseEnter = (place: ESPlace | ESRelatedPlace) => {
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

  if (places.length > 0) {
    return (
      <section className="h-[600px] overflow-hidden">
        <ul className="h-full overflow-auto relative rounded-lg">
          {places.map((place) => {
            return (
              <li
                id={`place-${place.uuid}`}
                className=" flex flex-col border-b border-2"
                key={`related-place-list-${place.uuid}`}
              >
                <RelatedSection
                  title={place.name}
                  defaultOpen={false}
                  toggleClassName="px-6"
                  headerClassName="text-lg"
                >
                  <button
                    className={`text-black/75 text-left md:py-1 ${
                      hoveredPlace?.uuid === place.uuid ? "bg-gray-100" : ""
                    } ${activePlace === place ? "" : ""}`}
                    onMouseEnter={() => handleMouseEnter(place)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      setHoveredPlace(undefined);
                      setActivePlace(place);
                    }}
                  >
                    <div className="p-4 w-full">
                      <img
                        src={
                          place.featured_photograph ??
                          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
                        }
                        className="max-w-48 max-h-48 mx-auto mb-4"
                        alt=""
                      />
                      <div
                        className="my-2 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: place.description ?? "",
                        }}
                      />
                      <a
                        className="text-blue-500 visited:text-blue-800 underline"
                        href={`/places/${place.slug}`}
                      >
                        Read More
                      </a>
                    </div>
                  </button>
                </RelatedSection>
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
