import { useContext, useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import RelatedPlacesList from "./RelatedPlacesList";
import { PlaceContext } from "~/contexts";
import RelatedPlacesMap from "./RelatedPlacesMap";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import type { FeatureCollection } from "geojson";
import type { ESRelatedPlace } from "~/esTypes";

interface Props {
  title?: string;
  collapsable?: boolean;
}

const RelatedPlaces = ({ title, collapsable = true }: Props) => {
  const { place } = useContext(PlaceContext);
  const [otherPlaces, setOtherPlaces] = useState<ESRelatedPlace[]>([]);
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>();

  useEffect(() => {
    if (!place) return;
    if (
      place.places.length == 0 ||
      (!place.types.includes("Barrier Island") &&
        !place.types.includes("County"))
    ) {
      setGeojson(toFeatureCollection([place]));
    } else if (!place.other_places || otherPlaces.length === 0) {
      setGeojson(toFeatureCollection(place.places));
    } else {
      setGeojson(toFeatureCollection([...place.places, ...otherPlaces]));
    }
  }, [place, otherPlaces]);

  useEffect(() => {
    if (!place?.other_places) setOtherPlaces([]);
  }, [place]);

  if (!place) return null;

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
        otherPlaces={otherPlaces}
        setOtherPlaces={setOtherPlaces}
      />
      {geojson && <RelatedPlacesMap geojson={geojson} />}
    </RelatedSection>
  );
};

export default RelatedPlaces;
