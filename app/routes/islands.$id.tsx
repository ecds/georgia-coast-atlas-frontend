import { useContext, useEffect, useState, Suspense } from "react";
import {
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
  Await,
} from "@remix-run/react";
import { dataHosts, defaultBounds, indexCollection } from "~/config.ts";
import { fetchBySlug } from "~/data/coredata";
import FeaturedMedium from "~/components/FeaturedMedium";
import { PlaceContext, MapContext } from "~/contexts";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Loading from "~/components/layout/Loading";
import Heading from "~/components/layout/Heading";
import PlaceContent from "~/components/layout/PlaceContent";
import { LngLatBounds } from "maplibre-gl";
import { pageMetadata } from "~/utils/pageMetadata";
import AsyncError from "~/components/errorResponses/AsyncError";
import NoRecord from "~/components/errorResponses/NoRecord";
import type { TWordPressData } from "~/types";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ESPlace, ESRelatedPlace } from "~/esTypes";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return pageMetadata(data?.place);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place: ESPlace = await fetchBySlug(params.id, indexCollection);

  if (!place) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return { place, wpData: wpData[0] };
};

const IslandPage = () => {
  const { wpData, place } = useLoaderData<typeof loader>();
  const { map, mapLoaded } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<
    ESRelatedPlace | undefined
  >();
  const [noTrackMouse, setNoTrackMouse] = useState<boolean>(false);
  // const navigation = useNavigation();

  // useEffect(() => {
  //   if (navigation.state === "idle" && map && place) {
  //     for (const islandLayer of islandStyle.layers) {
  //       map.setFilter(islandLayer.id, ["==", ["get", "uuid"], place.uuid]);
  //       map.setLayoutProperty(islandLayer.id, "visibility", "visible");
  //     }
  //   }

  //   if (navigation.state === "loading" && map && place) {
  //     for (const islandLayer of islandStyle.layers) {
  //       map.setFilter(islandLayer.id, undefined);
  //       map.setLayoutProperty(islandLayer.id, "visibility", "none");
  //     }
  //   }
  // }, [navigation, place, map]);

  useEffect(() => {
    if (!place || !place.bbox || !map) return;
    const fitBounds = () => {
      const bounds = new LngLatBounds(place.bbox);
      map.fitBounds(bounds);
      map.fitBounds(bounds);
    };
    map.on("resize", fitBounds);
    fitBounds();

    return () => {
      map.fitBounds(defaultBounds());
      map.off("resize", fitBounds);
    };
  }, [place, map, mapLoaded]);

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={place} errorElement={<AsyncError />}>
        {(place) => {
          if (place) {
            return (
              <PlaceContext.Provider
                value={{
                  place,
                  activeLayers,
                  setActiveLayers,
                  activePlace,
                  setActivePlace,
                  hoveredPlace,
                  setHoveredPlace,
                  noTrackMouse,
                  setNoTrackMouse,
                  full: true,
                  clusterFillColor: "#ea580c",
                  clusterTextColor: "black",
                }}
              >
                <PlaceContent>
                  <Heading
                    as="h1"
                    className="text-2xl px-4 py-2 sticky top-0 z-10 bg-white drop-shadow-md"
                  >
                    {place.name}
                  </Heading>
                  <div className="relative -top-12 z-10 min-h-10">
                    <FeaturedMedium record={place} />
                  </div>
                  <div
                    className="relative px-4 -mt-12 primary-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        wpData?.content.rendered ??
                        place.description ??
                        `<p>${place.short_description}</p>`,
                    }}
                  />
                </PlaceContent>
              </PlaceContext.Provider>
            );
          }
          return <NoRecord>Island not found.</NoRecord>;
        }}
      </Await>
    </Suspense>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <RouteError error={error} />;
  } else if (error instanceof Error) {
    return <CodeError error={error} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default IslandPage;
