import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import type { TVideoItem } from "../types";

interface Props {
  video: TVideoItem;
  imgClassName?: string;
  figClassName?: string;
}

const VideoThumbnail = ({ video, imgClassName, figClassName }: Props) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | undefined>(
    undefined,
  );

  useMemo(() => {
    switch (video.provider) {
      case "Vimeo":
        setThumbnailSrc(`https://vumbnail.com/${video.embed_id}.jpg`);
        break;
      case "YouTube":
        setThumbnailSrc(
          `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`,
        );
      default:
        break;
    }
    return;
  }, [video]);

  return (
    <figure className={`${figClassName ?? ""}`}>
      <div className="relative">
        <span className="text-white absolute w-full z-10 text-8xl h-full flex items-center justify-center">
          <FontAwesomeIcon
            icon={faPlayCircle}
            className="drop-shadow-2xl opacity-80"
          />
        </span>
        <img className={`${imgClassName ?? ""}`} src={thumbnailSrc} alt="" />
      </div>
      <figcaption>
        {video.source_titles.find((t) => t.primary)?.name.name}
      </figcaption>
    </figure>
  );
};

export default VideoThumbnail;
