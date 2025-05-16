import RelatedSection from "./RelatedSection";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { ESRelatedPlace } from "~/esTypes";

interface Props {
  className?: string;
  clickedPlace: ESRelatedPlace | undefined;
  hoveredPlace: ESRelatedPlace | undefined;
  places: ESRelatedPlace[];
  setClickedPlace: Dispatch<
    SetStateAction<ESRelatedPlace | ESRelatedPlace | undefined>
  >;
  setHoveredPlace: Dispatch<
    SetStateAction<ESRelatedPlace | ESRelatedPlace | undefined>
  >;
}

const RelatedPlacesDetailedList = ({
  className,
  clickedPlace,
  places,
  setClickedPlace,
  setHoveredPlace,
}: Props) => {
  const handleClick = (place: ESRelatedPlace) => {
    if (place == clickedPlace) {
      setClickedPlace(undefined);
    } else {
      setClickedPlace(place);
    }
  };

  useEffect(() => {
    if (!clickedPlace) return;
    const element = document.getElementById(`place-${clickedPlace.uuid}`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, [clickedPlace]);

  if (places.length > 0) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <ul className="h-full overflow-auto relative rounded-lg">
          {places.map((place) => {
            return (
              <li
                id={`place-${place.uuid}`}
                className=" flex flex-col border-b border-2"
                key={`related-place-list-${place.uuid}-${clickedPlace?.uuid === place.uuid}`}
                data-should-be-open={clickedPlace?.uuid === place.uuid}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(undefined)}
              >
                <RelatedSection
                  title={place.name}
                  defaultOpen={place.uuid === clickedPlace?.uuid}
                  toggleClassName="px-6"
                  headerClassName="text-lg"
                  onClick={() => handleClick(place)}
                >
                  <div className={`text-black/75 text-left md:py-1`}>
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
                  </div>
                </RelatedSection>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
};

export default RelatedPlacesDetailedList;
