import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PlaceContent = ({ children }: Props) => {
  return (
    <div className="w-full md:w-1/2 lg:w-2/5 overflow-scroll pb-32">
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default PlaceContent;
