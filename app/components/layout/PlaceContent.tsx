import type { ReactNode } from "react";
import RelatedRecords from "./RelatedRecords";

interface Props {
  children: ReactNode;
}

const PlaceContent = ({ children }: Props) => {
  return (
    <div className="w-full md:w-1/2 lg:w-2/5 overflow-scroll pb-32">
      <div className="flex flex-col">
        {children}
        <RelatedRecords />
      </div>
    </div>
  );
};

export default PlaceContent;
