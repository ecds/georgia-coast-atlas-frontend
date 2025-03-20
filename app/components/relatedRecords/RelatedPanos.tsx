import RelatedSection from "./RelatedSection";
import MediumModal from "../MediumModal";
import { useContext } from "react";
import { PlaceContext } from "~/contexts";

const RelatedPanos = () => {
  const { place } = useContext(PlaceContext);

  if (!place.panos || place.panos?.length === 0) {
    return null;
  }

  if (place.panos && place.panos.length > 0) {
    return (
      <RelatedSection title="Panos">
        <div className="flex flex-col justify-around space-y-4">
          {place.panos.map((pano) => {
            return (
              <MediumModal key={pano.embed_url} medium={pano}>
                <figure>
                  <img src={pano.thumbnail_url} alt="" />
                  <figcaption className="text-left">{pano.name}</figcaption>
                </figure>
              </MediumModal>
            );
          })}
        </div>
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedPanos;
