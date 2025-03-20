import RelatedSection from "./RelatedSection";
import VideoThumbnail from "../VideoThumbnail";
import MediumModal from "../MediumModal";
import { useContext, useEffect, useState } from "react";
import { PlaceContext } from "~/contexts";
import type { ESVideo } from "~/esTypes";

const RelatedVideos = () => {
  const { place } = useContext(PlaceContext);
  const [videos, setVideos] = useState<ESVideo[]>(place.videos);

  useEffect(() => {
    if (!place.types) return;

    if (place.types.includes("Barrier Island")) {
      setVideos([...(place.videos ?? []), ...(place.related_videos ?? [])]);
    } else {
      setVideos(place.videos ?? []);
    }

    return () => {
      setVideos([]);
    };
  }, [place]);

  if (!place.videos || place.videos?.length === 0) {
    return null;
  }

  if (videos && videos.length > 0) {
    return (
      <RelatedSection title="Videos">
        <div className="flex flex-wrap justify-around">
          {videos.map((video) => {
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
