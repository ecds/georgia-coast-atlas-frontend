import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CollectionList = ({ children }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-start mt-6 gap-4">
      {children}
    </div>
  );
};

export default CollectionList;
