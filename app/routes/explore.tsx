import { useContext, useState, useEffect, useCallback, Suspense } from "react";
import { MapContext } from "~/contexts";
import { useLoaderData, defer, Link, useNavigation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { fetchPlacesByType, fetchPlacesGeoJSON } from "~/data/coredata";
import { placesToFeatureCollection } from "~/utils/toFeatureCollection";
import IntroModal from "~/components/layout/IntroModal";
import Loading from "~/components/layout/Loading";
import Sidebar from "~/components/layout/Sidebar";
import PlacePopup from "~/components/PlacePopup";
import { defaultBounds, topBarHeight } from "~/config";
import type { MapMouseEvent, MapGeoJSONFeature } from "maplibre-gl";
import type { TPlace } from "~/types";
import type { LoaderFunction } from "@remix-run/node";
import type { FeatureCollection } from "geojson";

export const loader: LoaderFunction = async () => {
  const islands: TPlace[] = await fetchPlacesByType("Barrier Island");
  return defer({ islands });
};

export const HydrateFallback = () => {
  return <Loading />;
};

const Explore = () => {
  const { map, mapLoaded } = useContext(MapContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Modal state
  const [geojson, setGeojson] = useState<FeatureCollection>();
  const [activeIsland, setActiveIsland] = useState<TPlace | undefined>(
    undefined
  );
  const { islands } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  useEffect(() => {
    if (!map) return;
    if (navigation.state === "idle") map.fitBounds(defaultBounds());
  }, [map, navigation]);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      const islandGeoJSON = await fetchPlacesGeoJSON("Barrier Island");
      setGeojson(placesToFeatureCollection(islandGeoJSON) as FeatureCollection);
    };
    fetchGeoJSON();
  }, [islands]);

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
      className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})] max-w-96 px-4`}
    >
      {isModalOpen && <IntroModal setIsOpen={setIsModalOpen} />}{" "}
      <Suspense fallback={<Loading />}>
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
              </li>
            ))}
          </ul>
          {islands.map((island: TPlace) => {
            return (
              <ClientOnly key={`popup-${island.uuid}`}>
                {() => (
                  <PlacePopup
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
                )}
              </ClientOnly>
            );
          })}
        </Sidebar>
      </Suspense>
    </div>
  );
};

export default Explore;
