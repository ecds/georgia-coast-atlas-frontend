import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map.client";
import { MapContext, PlaceContext } from "~/contexts";
import { full } from "~/mapStyles/full";
import { Outlet, useLocation, useNavigate } from "react-router";
import { pointLayers } from "~/data/layers";
import MapInteractions from "~/components/MapInteractions";
import PlacePreview from "~/components/mapping/PlacePreview";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import type { ESRelatedPlace, ESPlace } from "~/esTypes";

const PlaceRoot = () => {
  const { map } = useContext(MapContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [place, setPlace] = useState<ESPlace | undefined>(undefined);
  const [clickedPlace, setClickedPlace] = useState<string | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESPlace | ESRelatedPlace | undefined
  >(undefined);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (location.pathname !== "/places" || !map) return;

    setHoveredPlace(undefined);
    setActiveLayers([]);
    setClickedPlace(undefined);

    for (const layer of pointLayers) {
      map.setFilter(`gca-${layer.sourceLayer}`, ["==", "$type", "Point"]);
    }
  }, [location, map]);

  useEffect(() => {
    const search = window.location.search;
    if (window.location.pathname === "/places") {
      setSearchParams(search);
    }
    if (clickedPlace && !window.location.pathname.includes(clickedPlace)) {
      navigate(`/places/${clickedPlace}`, {
        state: {
          fromIndex: window.location.pathname === "/places",
          search,
        },
      });
    }
  }, [clickedPlace, navigate]);

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
          <div className="absolute top-4 left-4 flex flex-col max-h-[calc(100vh-8rem)] w-[33vw] bg-white rounded-md drop-shadow-md overflow-hidden">
            <Outlet />
          </div>
          <MapInteractions />
          <PlacePreview />
        </Map>
      </ClientOnly>
    </PlaceContext.Provider>
  );
};

export default PlaceRoot;
