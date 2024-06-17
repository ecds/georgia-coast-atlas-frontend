import RelatedSection from "./RelatedSection";
import type { TCoreDataPlaceRecord } from "~/types";

const RelatedPlaces = ({ places }: { places: TCoreDataPlaceRecord[] }) => {
  return (
    <RelatedSection title="Related Places">
      {places.map((place) => {
        return (
          <button
            key={place.uuid}
            className="text-black/75 hover:text-black text-left md:py-1"
          >
            {place.name}
          </button>
        );
      })}
    </RelatedSection>
  );
};

export default RelatedPlaces;
