import RelatedSection from "./RelatedSection";
import VideoThumbnail from "../VideoThumbnail";
import VideoModal from "../VideoModal";
import { useContext, useEffect, useState } from "react";
import { PlaceContext } from "~/contexts";
import type { ESVideo } from "~/esTypes";

const RelatedVideos = () => {
  const { place, full } = useContext(PlaceContext);
  const [videos, setVideos] = useState<ESVideo[]>(place.videos);

  useEffect(() => {
    if (full) {
      setVideos([...(place.videos ?? []), ...(place.related_videos ?? [])]);
    }
  }, [full, place]);

  if (place.videos.length === 0 && place.related_videos?.length === 0) {
    return null;
  }

  if (videos && videos.length > 0) {
    return (
      <RelatedSection title="Videos">
        <div className="flex flex-wrap justify-around">
          {videos.map((video) => {
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
  }

  return null;
};

export default RelatedVideos;
