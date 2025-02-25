import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import RelatedPlaces from "../relatedRecords/RelatedPlaces";
import RelatedVideos from "../relatedRecords/RelatedVideos";
import RelatedPhotographs from "../relatedRecords/RelatedPhotographs";
import RelatedMapLayers from "../relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "../relatedRecords/RelatedTopoQuads";

const RelatedRecords = () => {
  const { full } = useContext(PlaceContext);
  return (
    <div className="p-6">
      {full && <RelatedPlaces />}
      <RelatedVideos />
      <RelatedPhotographs />
      <RelatedMapLayers />
      <RelatedTopoQuads />
    </div>
  );
};

export default RelatedRecords;
