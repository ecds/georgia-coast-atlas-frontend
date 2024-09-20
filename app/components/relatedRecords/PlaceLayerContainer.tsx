import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const PlaceLayerContainer = ({ children }: Props) => {
  return <div className="flex flex-row my-6">{children}</div>;
};

export const PlaceLayerBody = ({ children }: Props) => {
  return (
    <div className="pt-2 flex flex-col justify-center flex-grow">
      {children}
    </div>
  );
};

export const PlaceLayerTitle = ({ children }: Props) => {
  return <div className="text-xl pb-6">{children}</div>;
};
