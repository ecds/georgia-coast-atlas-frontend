import { useContext, useState } from "react";
import RelatedSection from "./RelatedSection";
import RelatedPlacesList from "./RelatedPlacesList";
import { PlaceContext } from "~/contexts";

interface Props {
  title?: string;
  collapsable?: boolean;
}

const RelatedPlaces = ({ title, collapsable = true }: Props) => {
  const { place } = useContext(PlaceContext);
  const [showAllPlaces, setShowAllPlaces] = useState<boolean>(false);

  if (!place) return null;

  if (
    place.places &&
    (place.types.includes("Barrier Island") || place.types.includes("County"))
  ) {
    return (
      <RelatedSection
        title={title ?? "Related Places"}
        collapsable={collapsable}
        className={
          place.places.length > 0 || place.other_places?.length > 0
            ? ""
            : "hidden"
        }
      >
        <RelatedPlacesList
          showAllPlaces={showAllPlaces}
          setShowAllPlaces={setShowAllPlaces}
        />
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedPlaces;
