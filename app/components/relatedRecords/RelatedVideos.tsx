import RelatedSection from "./RelatedSection";
import VideoThumbnail from "../VideoThumbnail";
import MediumModal from "../MediumModal";
import { useContext } from "react";
import { PlaceContext } from "~/contexts";

const RelatedVideos = () => {
  const { place } = useContext(PlaceContext);
  if (place.videos && place.videos.length > 0) {
    return (
      <RelatedSection title="Videos">
        <div className="flex flex-wrap justify-around">
          {place.videos.map((video) => {
            return (
              <MediumModal key={video.embed_id} medium={video}>
                <VideoThumbnail
                  video={video}
                  figClassName="md:my-8 md:mr-8 max-w-xs"
                  imgClassName="drop-shadow-md md:h-32  md:w-32"
                />
              </MediumModal>
            );
          })}
        </div>
      </RelatedSection>
    );
  }

  return null;
};

export default RelatedVideos;
