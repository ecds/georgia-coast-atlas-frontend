import type { ESVideo } from "~/esTypes";

interface Props {
  video: ESVideo;
}

const VideoEmbed = ({ video }: Props) => {
  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
      <iframe
        className="absolute t-0 l-0 h-full w-full"
        src={video.embed_url}
        title={video.name}
        allowFullScreen
      />
    </div>
  );
};

export default VideoEmbed;
