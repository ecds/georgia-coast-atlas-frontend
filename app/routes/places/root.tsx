import { useContext, useEffect, useState } from "react";
import ClientOnly from "~/components/ClientOnly";
import Map from "~/components/mapping/Map.client";
import { MapContext, PlaceContext } from "~/contexts";
import { full } from "~/mapStyles/full";
import { Outlet, useLocation } from "react-router";
import { pointLayers } from "~/data/layers";
import MapInteractions from "~/components/MapInteractions";
import type { ESRelatedPlace, ESPlace } from "~/esTypes";
import PlacePreview from "~/components/mapping/PlacePreview";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";

const MapRoute = () => {
  const { map } = useContext(MapContext);
  const location = useLocation();
  const [place, setPlace] = useState<ESPlace | undefined>(undefined);
  const [hoveredPlace, setHoveredPlace] = useState<
    ESPlace | ESRelatedPlace | undefined
  >(undefined);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);

  useEffect(() => {
    if (location.pathname !== "/places" || !map) return;

    setHoveredPlace(undefined);
    setActiveLayers([]);

    for (const layer of pointLayers) {
      map.setFilter(`gca-${layer.sourceLayer}`, ["==", "$type", "Point"]);
    }
  }, [location, map]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        setPlace,
        hoveredPlace,
        setHoveredPlace,
        activeLayers,
        setActiveLayers,
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

export default MapRoute;
