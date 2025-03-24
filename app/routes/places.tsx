import { NavLink, Outlet, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import Map from "~/components/mapping/Map.client";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import { MapContext } from "~/contexts";
import type { Map as TMap } from "maplibre-gl";

const linkClassNames = ({ isActive }: { isActive: boolean }) => {
  return `text-center flex-grow py-3 px-3 text-lg tracking-wide font-semibold text-white focus:outline-none ${isActive ? "bg-county" : "bg-ActiveCounty"} hover:bg-county/75 focus:outline-1 focus:outline-black`;
};

const PlacesRootPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<TMap>();
  const [hideTabs, setHideTabs] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setHideTabs(Boolean(location.state));
    containerRef.current?.scroll({ top: 0 });
  }, [location]);

  return (
    <MapContext.Provider value={{ map, setMap, mapLoaded, setMapLoaded }}>
      <div className={`flex flex-row overflow-hidden h-topOffset`}>
        <div
          ref={containerRef}
          className="overflow-y-scroll overflow-x-hidden transition-all w-full md:w-2/3 lg:w-2/5 bottom-36"
        >
          <div>
            <div
              className={`${hideTabs ? "hidden" : "flex"} w-full overflow-hidden sticky top-0 bg-activeCounty mx-auto z-50`}
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
                className={linkClassNames}
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
          <ClientOnly>
            {() => (
              <Map>
                <StyleSwitcher></StyleSwitcher>
              </Map>
            )}
          </ClientOnly>
        </div>
      </div>
    </MapContext.Provider>
  );
};

export default PlacesRootPage;
