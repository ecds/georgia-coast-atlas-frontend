import { useNavigate } from "@remix-run/react";
import type { ReactNode } from "react";

interface Props {
  itemType: "photograph" | "map" | "pano" | "video";
  children: ReactNode;
}

const Item = ({ itemType, children }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-activeCounty underline hover:font-semibold self-start capitalize"
      >
        Back to {itemType} Collection
      </button>
      {children}
    </div>
  );
};

export default Item;
