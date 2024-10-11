import { topBarHeight } from "~/config.ts";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const Sidebar = ({ title, children }: Props) => {
  return (
    <div
      className={`bg-white fixed top-20 left-0 h-[calc(100vh-${topBarHeight})] w-96 flex flex-col pt-6 px-4`}
    >
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-black mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
