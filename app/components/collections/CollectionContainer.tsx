import type { ReactNode } from "react";
import type { CollectionType } from "~/esTypes";

interface Props {
  collectionType: CollectionType;
  children: ReactNode;
}

const CollectionContainer = ({ collectionType, children }: Props) => {
  return (
    <div className="-mt-16 md:mt-0 h-full overflow-auto flex-grow">
      <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2 capitalize">
        {collectionType}
      </h1>
      {children}
    </div>
  );
};

export default CollectionContainer;
