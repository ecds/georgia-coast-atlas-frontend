import { NavLink, useNavigate } from "@remix-run/react";
import { islands, topBarHeight } from "~/config.ts";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white fixed top-20 left-0 h-[calc(100vh-${topBarHeight})] w-96 flex flex-col pt-6 px-4`}
    >
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-black mb-4">
          Explore the Islands
        </h2>
        <ul className="space-y-2 divide-y divide-gray-200">
          {islands.map((island) => (
            <li
              key={island.slug}
              className="flex justify-between py-2 items-center"
            >
              <span className="font-bold text-black">
                {island.label} Island
              </span>
              <button
                className="bg-white text-sm font-bold py-2 px-6 rounded-lg border-2 border-black flex items-center justify-center transition-colors duration-300 hover:bg-gray-100"
                onClick={() => navigate(`/${island.slug}-island`)}
              >
                Explore <span className="ml-1">→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
