import { NavLink, Outlet, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map.client";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";

const linkClassNames = ({ isActive }: { isActive: boolean }) => {
  return `text-center flex-grow py-3 px-3 text-lg tracking-wide font-semibold focus:outline-none ${isActive ? "bg-activeCounty text-white" : "bg-county/25 text-activeCounty hover:text-white"} hover:bg-county/75  focus:outline-1 focus:outline-black`;
};

const PlacesRootPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTabs, setShowTabs] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setShowTabs(
      location.pathname.includes("explore") ||
        location.pathname.includes("search")
    );
    containerRef.current?.scroll({ top: 0 });
  }, [location]);

  return (
    <div className={`flex flex-row overflow-hidden h-topOffset`}>
      <div
        ref={containerRef}
        className="overflow-y-scroll overflow-x-hidden transition-all w-full md:w-2/3 lg:w-2/5 bottom-36"
      >
        <div>
          <div
            className={`${showTabs ? "flex" : "hidden"} bg-white w-full overflow-hidden sticky top-0 mx-auto z-50 drop-shadow-sm`}
            role="tablist"
            aria-orientation="horizontal"
          >
            <NavLink
              to="/places/search"
              className={({ isActive }) =>
                `${linkClassNames({ isActive })} border-r-2`
              }
              role="tab"
            >
              Search
            </NavLink>
            <NavLink
              to="/places/explore"
              className={({ isActive }) =>
                `${linkClassNames({ isActive })} border-r-2`
              }
              role="tab"
            >
              Explore
            </NavLink>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
      <div className="hidden md:block flex-grow">
        {typeof window !== "undefined" && (
          <ClientOnly>
            <Map>
              <StyleSwitcher />
            </Map>
          </ClientOnly>
        )}
      </div>
    </div>
  );
};

export default PlacesRootPage;
