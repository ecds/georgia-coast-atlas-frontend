import { useEffect, useState } from "react";
import MediumModal from "../MediumModal";
import MediumThumbnail from "../MediumThumbnail";
import type { ESRelatedMedium } from "~/esTypes";
import RelatedSection from "./RelatedSection";
import { RelatedMediaContext } from "~/contexts";

interface Props {
  bodyClassName?: string;
  className?: string;
  collapsable?: boolean;
  defaultOpen?: boolean;
  headerClassName?: string;
  nested?: boolean;
  records: ESRelatedMedium[] | undefined;
  title: string;
}

const RelatedMedia = ({ title, records }: Props) => {
  const [groupOne, setGroupOne] = useState<ESRelatedMedium[]>([]);
  const [groupTwo, setGroupTwo] = useState<ESRelatedMedium[]>([]);
  const [mediaDisplayed, setMediaDisplayed] = useState<ESRelatedMedium[]>([]);
  const [showingMore, setShowingMore] = useState<boolean>(false);
  const [activeMedium, setActiveMedium] = useState<ESRelatedMedium | undefined>(
    undefined
  );

  useEffect(() => {
    if (!records) return;
    const recordsCopy = records;
    setGroupTwo(recordsCopy.slice(6));
    setGroupOne(recordsCopy.slice(0, 6));
  }, [records]);

  useEffect(() => {
    if (showingMore) {
      setMediaDisplayed([...groupOne, ...groupTwo]);
    } else {
      setMediaDisplayed(groupOne);
    }
  }, [showingMore, groupOne, groupTwo]);

  if (!records || records.length === 0) {
    return null;
  }

  return (
    <RelatedMediaContext.Provider value={{ activeMedium, setActiveMedium }}>
      <RelatedSection title={title}>
        <div
          className={`flex ${title === "Panos" ? "flex-col space-y-4" : "flex-wrap"} justify-around`}
        >
          {mediaDisplayed?.map((record) => {
            return (
              <MediumModal
                key={`${title}-${record.uuid}`}
                medium={record}
                media={[...groupOne, ...groupTwo]}
              >
                <MediumThumbnail medium={record} />
              </MediumModal>
            );
          })}
        </div>
        {groupTwo && groupTwo.length > 0 && (
          <button
            type="button"
            className="mt-4 p-2 bg-island text-white rounded"
            onClick={() => setShowingMore(!showingMore)}
          >
            {showingMore ? "Show Less" : "Show More"}
          </button>
        )}
      </RelatedSection>
    </RelatedMediaContext.Provider>
  );
};

export default RelatedMedia;
