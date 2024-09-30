import type { ReactNode } from "react";
import { topBarHeight } from "~/config";

interface Props {
  children: ReactNode;
}

const PlaceContainer = ({ children }: Props) => {
  return (
    <div
      className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
    >
      {children}
    </div>
  );
};

export default PlaceContainer;
