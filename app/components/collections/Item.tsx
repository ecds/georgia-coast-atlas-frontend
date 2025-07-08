import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const Item = ({ children, className }: Props) => {
  return <div className={`flex flex-col p-6 ${className}`}>{children}</div>;
};

export default Item;
