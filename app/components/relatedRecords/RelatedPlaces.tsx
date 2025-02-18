import { useContext, useState } from "react";
import RelatedSection from "./RelatedSection";
import RelatedPlacesList from "./RelatedPlacesList";
import type { ESRelatedPlace } from "~/esTypes";
import { PlaceContext } from "~/contexts";
import RelatedPlacesMap from "./RelatedPlacesMap";

interface Props {
  title?: string;
  collapsable?: boolean;
}

const RelatedPlaces = ({ title, collapsable = true }: Props) => {
  const { place } = useContext(PlaceContext);
  const [otherPlaces, setOtherPlaces] = useState<ESRelatedPlace[]>([]);

  if (place.places?.length > 0 || otherPlaces.length > 0) {
    return (
      <RelatedSection
        title={title ?? "Related Places"}
        collapsable={collapsable}
      >
        <RelatedPlacesList
          otherPlaces={otherPlaces}
          setOtherPlaces={setOtherPlaces}
        />
        <RelatedPlacesMap otherPlaces={otherPlaces} />
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedPlaces;
