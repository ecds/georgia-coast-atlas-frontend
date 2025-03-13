import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CollectionList = ({ children }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start mt-6 gap-4 h-topOffset overflow-hidden">
      {children}
    </div>
  );
};

export default CollectionList;
