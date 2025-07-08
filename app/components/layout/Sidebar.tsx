import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const Sidebar = ({ title, children }: Props) => {
  return (
    <div className="overflow-y-auto px-4">
      <h2 className="text-xl font-bold text-black mb-4 pt-4">{title}</h2>
      {children}
    </div>
  );
};

export default Sidebar;
