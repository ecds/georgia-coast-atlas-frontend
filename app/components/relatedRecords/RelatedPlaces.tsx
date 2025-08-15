import { useContext, useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import RelatedPlacesList from "./RelatedPlacesList";
import { PlaceContext } from "~/contexts";
import RelatedPlacesMap from "./RelatedPlacesMap";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import type { FeatureCollection } from "geojson";

interface Props {
  title?: string;
  collapsable?: boolean;
}

const RelatedPlaces = ({ title, collapsable = true }: Props) => {
  const { place } = useContext(PlaceContext);
  const [showAllPlaces, setShowAllPlaces] = useState<boolean>(false);
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>();

  useEffect(() => {
    if (!place || !place.places) return;
    if (
      (place.places && place.places.length == 0) ||
      (!place.types.includes("Barrier Island") &&
        !place.types.includes("County"))
    ) {
      setGeojson(toFeatureCollection([place]));
    } else if (!showAllPlaces) {
      setGeojson(toFeatureCollection(place.places));
    } else {
      setGeojson(toFeatureCollection([...place.places, ...place.other_places]));
    }
  }, [place, showAllPlaces]);

  if (!place) return null;

  if (place.places) {
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
        {geojson && <RelatedPlacesMap geojson={geojson} />}
      </RelatedSection>
    );
  }

  if (place.geojson) {
    return <RelatedPlacesMap geojson={place.geojson} />;
  }

  return null;
};

export default RelatedPlaces;
