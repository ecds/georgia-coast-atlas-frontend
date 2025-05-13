import { useNavigate } from "@remix-run/react";
import type { ReactNode } from "react";

interface Props {
  itemType?: "photograph" | "map" | "pano" | "video";
  children: ReactNode;
  className?: string;
}

const Item = ({ itemType, children, className }: Props) => {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col p-6 ${className}`}>
      {itemType && (
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-activeCounty underline hover:font-semibold self-start capitalize"
        >
          Back to {itemType} Collection
        </button>
      )}
      {children}
    </div>
  );
};

export default Item;
