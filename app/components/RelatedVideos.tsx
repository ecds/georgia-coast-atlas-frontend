import type { TVideoItem } from "~/types";
import RelatedSection from "./RelatedSection";
import VideoThumbnail from "./VideoThumbnail";
import VideoModal from "./VideoModal";

interface Props {
  videos: TVideoItem[];
}

const RelatedVideos = ({ videos }: Props) => {
  return (
    <RelatedSection title="Videos">
      <div className="flex flex-wrap justify-around">
        {videos.map((video) => {
          return (
            <VideoModal key={video.uuid} video={video}>
              <VideoThumbnail
                video={video}
                figClassName="md:m-8 max-w-xs"
                imgClassName="drop-shadow-md border rounded-lg"
              />
            </VideoModal>
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedVideos;
