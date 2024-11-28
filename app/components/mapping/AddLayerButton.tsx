import type { ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
  image: string;
}

const AddLayerButton = ({ onClick, children, image }: Props) => {
  return (
    <button
      onClick={onClick}
      className="md:mr-8 w-32 drop-shadow-md h-auto md:h-32 mx-auto bg-cover flex items-end rounded-md"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <span className="text-center w-32 bg-black/65 text-white py-2 uppercase text-lg rounded-b-md">
        {children}
      </span>
    </button>
  );
};

export default AddLayerButton;
