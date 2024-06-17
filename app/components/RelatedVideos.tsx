import type { TVideoItem } from "~/types";
import RelatedSection from "./RelatedSection";
import VideoThumbnail from "./VideoThumbnail";

interface Props {
  videos: TVideoItem[];
}

const RelatedVideos = ({ videos }: Props) => {
  return (
    <RelatedSection title="Videos">
      <div className="flex flex-wrap justify-around">
        {videos.map((video) => {
          return (
            <VideoThumbnail
              key={video.uuid}
              video={video}
              figClassName="md:m-8 max-w-xs"
              imgClassName="drop-shadow-md border rounded-lg"
            />
          );
        })}
      </div>
    </RelatedSection>
  );
};

export default RelatedVideos;
