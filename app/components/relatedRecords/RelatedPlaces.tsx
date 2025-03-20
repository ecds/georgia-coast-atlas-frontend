import { useContext, useEffect, useState } from "react";
import RelatedSection from "./RelatedSection";
import RelatedPlacesList from "./RelatedPlacesList";
import { PlaceContext } from "~/contexts";
import RelatedPlacesMap from "./RelatedPlacesMap";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import PlacePopup from "../mapping/PlacePopup.client";
import { Link } from "@remix-run/react";
import type { FeatureCollection } from "geojson";
import type { ESRelatedPlace } from "~/esTypes";

interface Props {
  title?: string;
  collapsable?: boolean;
}

const RelatedPlaces = ({ title, collapsable = true }: Props) => {
  const { place, activePlace, setActivePlace } = useContext(PlaceContext);
  const [otherPlaces, setOtherPlaces] = useState<ESRelatedPlace[]>([]);
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>();

  useEffect(() => {
    if (place.places.length == 0) {
      setGeojson(toFeatureCollection([place]));
    } else if (!place.other_places || otherPlaces.length === 0) {
      setGeojson(toFeatureCollection(place.places));
    } else {
      setGeojson(toFeatureCollection([...place.places, ...otherPlaces]));
    }
  }, [place, otherPlaces]);

  useEffect(() => {
    if (!place.other_places) setOtherPlaces([]);
  }, [place]);

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
      {activePlace && (
        <PlacePopup
          location={activePlace.location}
          show={true}
          onClose={() => setActivePlace(undefined)}
          zoomToFeature={false}
        >
          {activePlace.preview && (
            <img src={activePlace.preview.replace("max", "600,")} alt="" />
          )}
          <h4 className="text-xl">{activePlace.name}</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: activePlace.description ?? "",
            }}
          />
          <Link
            to={`/places/${activePlace.slug}`}
            state={{ slug: place.slug, title: place.name }}
            className="text-blue-600 underline underline-offset-2 hover:text-blue-900"
          >
            Read More
          </Link>
        </PlacePopup>
      )}
    </RelatedSection>
  );
};

export default RelatedPlaces;
