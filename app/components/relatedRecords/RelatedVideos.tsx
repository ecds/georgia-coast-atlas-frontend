import RelatedSection from "./RelatedSection";
import VideoThumbnail from "../VideoThumbnail";
import VideoModal from "../VideoModal";
import { useContext } from "react";
import { PlaceContext } from "~/contexts";

const RelatedVideos = () => {
  const { place } = useContext(PlaceContext);

  if (place.videos.length === 0) {
    return null;
  }
  return (
    <RelatedSection title="Videos">
      <div className="flex flex-wrap justify-around">
        {place.videos.map((video) => {
          return (
            <VideoModal key={video.embed_id} video={video}>
              <VideoThumbnail
                video={video}
                figClassName="md:my-8 md:mr-8 max-w-xs"
                imgClassName="drop-shadow-md md:h-32  md:w-32"
              />
            </VideoModal>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedVideos;
