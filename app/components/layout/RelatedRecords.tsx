import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import RelatedPlaces from "../relatedRecords/RelatedPlaces";
import RelatedVideos from "../relatedRecords/RelatedVideos";
import RelatedPhotographs from "../relatedRecords/RelatedPhotographs";
import RelatedMapLayers from "../relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "../relatedRecords/RelatedTopoQuads";

const RelatedRecords = () => {
  const { place, manifestLabel } = useContext(PlaceContext);
  return (
    <>
      <RelatedPlaces />
      <RelatedVideos />
      <RelatedPhotographs
        manifest={place.manifests.find(
          (manifest) => manifest.label === manifestLabel
        )}
      />
      {/* <RelatedMapLayers layers={place.places.mapLayers} />
      <RelatedTopoQuads quads={place.places.topoQuads} /> */}
    </>
  );
};

export default RelatedRecords;
