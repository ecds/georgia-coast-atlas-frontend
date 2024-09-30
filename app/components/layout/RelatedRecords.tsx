import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import RelatedPlaces from "../relatedRecords/RelatedPlaces";
import RelatedVideos from "../relatedRecords/RelatedVideos";
import RelatedPhotographs from "../relatedRecords/RelatedPhotographs";
import RelatedMapLayers from "../relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "../relatedRecords/RelatedTopoQuads";
import type { TRelatedCoreDataRecords } from "~/types";

interface Props {
  related: TRelatedCoreDataRecords;
}

const RelatedRecords = ({ related }: Props) => {
  const { place } = useContext(PlaceContext);
  return (
    <>
      {related.places?.relatedPlaces && (
        <RelatedPlaces places={related.places.relatedPlaces} />
      )}
      {related.items?.videos && <RelatedVideos videos={related.items.videos} />}
      {related.media_contents?.photographs && (
        <RelatedPhotographs manifest={place.iiif_manifest} />
      )}
      {related.places?.mapLayers && (
        <RelatedMapLayers layers={related.places.mapLayers} />
      )}
      {related.places?.topoQuads && (
        <RelatedTopoQuads quads={related.places.topoQuads} />
      )}
    </>
  );
};

export default RelatedRecords;
