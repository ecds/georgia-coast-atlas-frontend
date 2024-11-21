import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import type { ESVideo } from "~/esTypes";

interface Props {
  video: ESVideo;
  imgClassName?: string;
  figClassName?: string;
}

const VideoThumbnail = ({ video, imgClassName, figClassName }: Props) => {
  return (
    <figure className={`${figClassName ?? ""}`}>
      <div className="relative">
        <span className="text-white absolute w-32 z-10 text-6xl h-full flex items-center justify-center">
          <FontAwesomeIcon
            icon={faPlayCircle}
            className="drop-shadow-2xl opacity-80"
          />
        </span>
        <img
          className={`${imgClassName ?? ""}`}
          src={video.thumbnail_url}
          alt=""
        />
      </div>
      <figcaption className="md:w-32 text-left">{video.name}</figcaption>
    </figure>
  );
};

export default VideoThumbnail;
