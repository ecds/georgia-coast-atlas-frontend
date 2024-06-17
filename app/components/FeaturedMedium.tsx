import VideoEmbed from "./VideoEmbed";
import type { TRelatedCoreDataRecords } from "~/types";

interface Props {
  record: TRelatedCoreDataRecords;
}

const FeaturedMedium = ({ record }: Props) => {
  if (record.items?.videos) {
    return <VideoEmbed video={record.items.videos[0]} />;
  }
  if (record.media_contents?.photographs) {
    return (
      <img src={record.media_contents.photographs[0].content_url} alt="" />
    );
  }
  return <></>;
};

export default FeaturedMedium;
