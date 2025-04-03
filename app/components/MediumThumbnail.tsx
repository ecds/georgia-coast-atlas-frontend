import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import type { ESRelatedMedium } from "~/esTypes";

interface Props {
  medium: ESRelatedMedium;
  figureClassName?: string;
  imageClassName?: string;
  captionClassName?: string;
}

const MediumThumbnail = ({
  medium,
  figureClassName,
  imageClassName,
  captionClassName,
}: Props) => {
  if (!medium) return null;

  return (
    <figure
      className={
        figureClassName ??
        `${medium.media_type === "pano" ? "" : "md:my-8 md:mr-8 max-w-xs"}`
      }
    >
      <div className="relative">
        {medium.media_type === "video" && (
          <span className="text-white absolute w-32 z-[2] text-6xl h-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faPlayCircle}
              className="drop-shadow-2xl opacity-80"
            />
          </span>
        )}
        <img
          className={`${imageClassName} ${medium.media_type === "pano" ? "" : "drop-shadow-md md:h-32  md:w-32"}`}
          src={medium.thumbnail_url}
          alt=""
        />
      </div>
      <figcaption
        className={
          captionClassName ??
          `${medium.media_type === "pano" ? "md:w-full" : "md:w-32"} text-left truncate`
        }
      >
        {medium.name}
      </figcaption>
    </figure>
  );
};

export default MediumThumbnail;
