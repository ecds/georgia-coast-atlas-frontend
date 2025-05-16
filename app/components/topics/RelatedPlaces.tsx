import { useState } from "react";
import TopicMap from "./TopicMap";
import Heading from "../layout/Heading";
import RelatedPlacesDetailedList from "../relatedRecords/RelatedPlacesDetailedList";
import type { ESRelatedPlace, ESTopic } from "~/esTypes";

interface Props {
  topic: ESTopic | undefined;
}

const RelatedPlaces = ({ topic }: Props) => {
  const [clickedPlace, setClickedPlace] = useState<
    ESRelatedPlace | undefined
  >();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();
  if (topic && topic.places) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-9 mb-12 md:gap-2 lg:gap-4">
        <Heading
          as="h2"
          className="text-2xl capitalize col-span-1 md:col-span-6 lg:col-span-9"
        >
          Places
        </Heading>
        <div className="rounded-lg bg-county/25 md:col-span-2 lg:col-span-3 mb-8 md:mb-0">
          <RelatedPlacesDetailedList
            places={topic.places}
            className="h-[66vh]"
            clickedPlace={clickedPlace}
            hoveredPlace={hoveredPlace}
            setClickedPlace={setClickedPlace}
            setHoveredPlace={setHoveredPlace}
          />
        </div>
        <div className="relative overflow-hidden rounded-lg md:col-span-4 lg:col-span-6">
          <TopicMap
            topic={topic}
            className="h-[66vh]"
            clickedPlace={clickedPlace}
            hoveredPlace={hoveredPlace}
            setClickedPlace={setClickedPlace}
            setHoveredPlace={setHoveredPlace}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default RelatedPlaces;
