// import PlaceFacets from "./PlaceFacets";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

const CollectionItems = ({ children, title }: Props) => {
  return (
    <div>
      {/* <PlaceFacets /> */}
      <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2">{title}</h1>
      {children}
    </div>
  );
};

export default CollectionItems;
