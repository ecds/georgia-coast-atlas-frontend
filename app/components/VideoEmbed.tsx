import { useMemo, useState } from "react";
import type { TVideoItem } from "../types";

interface Props {
  video: TVideoItem;
}

const VideoEmbed = ({ video }: Props) => {
  const [embedSrc, setEmbedSrc] = useState<string | undefined>(undefined);

  useMemo(() => {
    switch (video.provider) {
      case "Vimeo":
        setEmbedSrc(`https://player.vimeo.com/video/${video.embed_id}`);
        break;
      case "YouTube":
        setEmbedSrc(`https://www.youtube.com/embed/${video.embed_id}`);
      default:
        break;
    }
    return;
  }, [video]);

  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
      <iframe
        className="absolute t-0 l-0 h-full w-full"
        src={embedSrc}
        title={video.source_titles.find((t) => t.primary)?.name.name}
        allowFullScreen
      />
    </div>
  );
};

export default VideoEmbed;
