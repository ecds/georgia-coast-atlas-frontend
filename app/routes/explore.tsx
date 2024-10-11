import { useContext, useState, useEffect, useCallback, Suspense } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData, defer, Link, useNavigate } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import Map from "~/components/mapping/Map.client";
import { fetchPlacesByType } from "~/data/coredata";
import { placesToFeatureCollection } from "~/utils/toFeatureCollection";
import type { TPlace } from "~/types";
import type { LoaderFunction } from "@remix-run/node";
import "maplibre-gl/dist/maplibre-gl.css";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import Loading from "~/components/layout/Loading";
import Sidebar from "~/components/layout/Sidebar";
import PlacePopup from "~/components/PlacePopup";
import type { MapMouseEvent, MapGeoJSONFeature } from "maplibre-gl";
import { topBarHeight } from "~/config";

export const loader: LoaderFunction = async () => {
  const islands: TPlace[] = await fetchPlacesByType("Barrier Island");
  const geojson = placesToFeatureCollection(islands);
  return defer({ islands, geojson });
};

export const HydrateFallback = () => {
  return <Loading />;
};

const Explore = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const [activeIsland, setActiveIsland] = useState<TPlace | undefined>(
    undefined
  );
  const { islands, geojson } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(() => {
    if (map) map.getCanvas().style.cursor = "pointer";
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (map) map.getCanvas().style.cursor = "";
  }, [map]);

  const handleClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      }
    ) => {
      if (!map && !event.features) return;
      const clickedIsland = islands.find((island: TPlace) => {
        if (event.features)
          return island.name === event.features[0].properties.name;
        return undefined;
      });
      setActiveIsland(clickedIsland);
    },
    [map, islands]
  );

  useEffect(() => {
    if (!map || !mapLoaded || !geojson) return;

    if (map.getSource("islands")) map.removeSource("islands");

    map.addSource("islands", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "islands-fill",
      type: "fill",
      source: "islands",
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.25,
      },
    });

    map.addLayer({
      id: "islands-outline",
      type: "line",
      source: "islands",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue",
        "line-width": 2,
        "line-opacity": 0.5,
      },
    });

    map.on("mouseenter", "islands-fill", handleMouseEnter);
    map.on("mouseleave", "islands-fill", handleMouseLeave);
    map.on("click", "islands-fill", handleClick);

    return () => {
      if (map.getLayer("islands-fill")) map.removeLayer("islands-fill");
      if (map.getLayer("islands-outline")) map.removeLayer("islands-outline");
      if (map.getSource("islands")) map.removeSource("islands");
      map.off("mouseenter", "islands-fill", handleMouseEnter);
      map.off("mouseleave", "islands-fill", handleMouseLeave);
      map.off("click", "islands-fill", handleClick);
    };
  }, [
    map,
    mapLoaded,
    geojson,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
  ]);

  return (
    <div
      className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
    >
      <Suspense fallback={<Loading />}>
        <div className="w-1/3 verflow-scroll pb-32">
          <Sidebar title="Explore the Islands">
            <ul className="space-y-2 divide-y divide-gray-200">
              {islands.map((island: TPlace) => (
                <li
                  key={island.uuid}
                  className="flex justify-between py-2 items-center"
                >
                  <Link
                    to={`/islands/${island.slug}`}
                    className="font-bold text-black"
                  >
                    {island.name}
                  </Link>
                  <button
                    className="bg-white text-sm font-bold py-2 px-6 rounded-lg border-2 border-black flex items-center justify-center transition-colors duration-300 hover:bg-gray-100"
                    onClick={() => navigate(`/islands/${island.slug}`)}
                  >
                    Explore <span className="ml-1">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </Sidebar>
        </div>
        <div className="w-3/4">
          <ClientOnly>
            {() => (
              <Map>
                <StyleSwitcher />
                {islands.map((island: TPlace) => {
                  return (
                    <PlacePopup
                      key={`popup-${island.uuid}`}
                      show={activeIsland == island}
                      location={island.location}
                      onClose={() => setActiveIsland(undefined)}
                      zoomToFeature={false}
                    >
                      <h4 className="text-xl ">{island.name}</h4>
                      <Link
                        to={`/islands/${island.slug}`}
                        className="text-blue-700 underline underline-offset-2 text-l block mt-2"
                      >
                        Explore
                      </Link>
                    </PlacePopup>
                  );
                })}
              </Map>
            )}
          </ClientOnly>
        </div>
      </Suspense>
    </div>
  );
};

export default Explore;
