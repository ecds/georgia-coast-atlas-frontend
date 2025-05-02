import { NavLink } from "@remix-run/react";

const linkClassNames = ({ isActive }: { isActive: boolean }) => {
  return `text-center flex-grow py-3 px-3 text-lg tracking-wide font-semibold text-white focus:outline-none ${isActive ? "bg-county" : "bg-county/45"} hover:bg-county/75 focus:outline-1 focus:outline-black`;
};

const NavTabs = ({ activeTab }: { activeTab: string }) => {
  return (
    <div
      className={`flex w-full overflow-hidden sticky top-0 bg-activeCounty mx-auto z-50`}
      role="tablist"
      aria-orientation="horizontal"
    >
      <NavLink
        to="/places/search"
        className={`${linkClassNames({ isActive: activeTab === "search" })} border-r-2`}
        role="tab"
      >
        Search
      </NavLink>
      <NavLink
        to="/places/explore"
        className={`${linkClassNames({ isActive: activeTab === "explore" })} border-r-2`}
        role="tab"
      >
        Explore
      </NavLink>
    </div>
  );
};

export default NavTabs;
