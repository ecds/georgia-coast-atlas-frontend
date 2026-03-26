import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map.client";
import { MapContext, PlaceContext } from "~/contexts";
import { full } from "~/mapStyles/full";
import { Outlet, useLocation, useNavigate } from "react-router";
import { pointLayers } from "~/data/layers";
import MapInteractions from "~/components/mapping/MapInteractions";
import PlacePreview from "~/components/mapping/PlacePreview";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import type { ESRelatedPlace, ESPlace } from "~/esTypes";
import type { Hit } from "instantsearch.js";

const LIST_ROUTES = new Set(["/places", "/places/search", "/places/explore"]);
const MOBILE_BREAKPOINT = "(max-width: 767px)";

const PlaceRoot = () => {
  const { map } = useContext(MapContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [place, setPlace] = useState<ESPlace | undefined>(undefined);
  const [clickedPlace, setClickedPlace] = useState<string | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESPlace | ESRelatedPlace | Hit | undefined
  >(undefined);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<string | undefined>(
    undefined
  );
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_BREAKPOINT).matches;
  });

  const isListRoute = LIST_ROUTES.has(location.pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!isListRoute || !map) return;

    setHoveredPlace(undefined);
    setActiveLayers([]);
    setClickedPlace(undefined);

    for (const layer of pointLayers) {
      map.setFilter(`gca-${layer.sourceLayer}`, ["==", "$type", "Point"]);
    }
  }, [isListRoute, map]);

  useEffect(() => {
    if (isListRoute) {
      setSearchParams(location.search);
    }
  }, [isListRoute, location.search]);

  useEffect(() => {
    if (!clickedPlace) return;
    if (location.pathname.includes(clickedPlace)) return;

    navigate(`/places/${clickedPlace}`, {
      state: {
        fromIndex: isListRoute,
        pathname: location.pathname,
        search: location.search,
      },
    });
  }, [clickedPlace, isListRoute, location.pathname, location.search, navigate]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        setPlace,
        hoveredPlace,
        setHoveredPlace,
        activeLayers,
        searchParams,
        setSearchParams,
        setActiveLayers,
        setClickedPlace,
      }}
    >
      <ClientOnly>
        <Map style={full}>
          <StyleSwitcher />

          {isMobile ? (
            isListRoute ? (
              <div className="absolute inset-x-0 bottom-0 z-20 flex max-h-[72dvh] flex-col overflow-hidden">
                <div className="flex justify-center pb-2">
                  <div className="h-1.5 w-12 rounded-full bg-white/80 backdrop-blur-sm" />
                </div>

                <div className="min-h-0 flex-1 overflow-hidden rounded-t-2xl bg-white shadow-2xl">
                  <Outlet />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 z-30 overflow-hidden bg-white">
                <Outlet />
              </div>
            )
          ) : (
            <div className="absolute top-4 left-4 z-20 flex max-h-[calc(100dvh-8rem)] w-[min(420px,33vw)] min-w-[320px] flex-col overflow-hidden rounded-md bg-white shadow-xl">
              <Outlet />
            </div>
          )}

          <MapInteractions />
          <PlacePreview />
        </Map>
      </ClientOnly>
    </PlaceContext.Provider>
  );
};

export default PlaceRoot;