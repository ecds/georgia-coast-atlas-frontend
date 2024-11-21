import type { ESPlace } from "~/esTypes";
import VideoEmbed from "./VideoEmbed";

interface Props {
  record: ESPlace;
}

const FeaturedMedium = ({ record }: Props) => {
  if (record.featured_video) {
    return <VideoEmbed video={record.featured_video} />;
  }
  if (record.featured_photograph) {
    return <img src={record.featured_photograph} alt="" />;
  }
  return <></>;
};

export default FeaturedMedium;
