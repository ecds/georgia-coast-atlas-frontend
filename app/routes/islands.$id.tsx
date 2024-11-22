import { useContext, useEffect, useRef, useState, Suspense } from "react";
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  Await
} from "@remix-run/react";
import { dataHosts } from "~/config.ts";
import { fetchPlaceBySlug } from "~/data/coredata";
import FeaturedMedium from "~/components/FeaturedMedium";
import { PlaceContext, MapContext } from "~/contexts";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Loading from "~/components/layout/Loading";
import Heading from "~/components/layout/Heading";
// import PlaceGeoJSON from "~/components/mapping/PlaceGeoJSON";
import { islands as islandStyle } from "~/mapStyles";
import PlaceContent from "~/components/layout/PlaceContent";
import type { TWordPressData, TIslandClientData, TPlaceSource } from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const place = await fetchPlaceBySlug(params.id);

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

// export const clientLoader = async ({
//   serverLoader,
// }: ClientLoaderFunctionArgs) => {
//   const serverData = await serverLoader<TIslandServerData>();
//   const relatedRecords: TRelatedCoreDataRecords | {} =
//     await fetchRelatedRecords(serverData.place.uuid);

//   return { ...serverData, ...relatedRecords };
// };

// clientLoader.hydrate = true;

export const HydrateFallback = () => {
  return <Loading />;
};

const IslandPage = () => {
  const { wpData, place } = useLoaderData<TIslandClientData>();
  const { map, mapLoaded } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [layerSources, setLayerSources] = useState<TPlaceSource>({});
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle" && map) {
      for (const islandLayer of islandStyle.layers) {
        map.setFilter(islandLayer.id, ["==", ["get", "uuid"], place.uuid]);
        map.setLayoutProperty(islandLayer.id, "visibility", "visible");
      }

      topRef.current?.scrollIntoView();
    }

    if (navigation.state === "loading" && map) {
      for (const islandLayer of islandStyle.layers) {
        map.setFilter(islandLayer.id, undefined);
        map.setLayoutProperty(islandLayer.id, "visibility", "none");
      }
    }
  }, [navigation, place, map]);

  useEffect(() => {
    if (
      !mapLoaded ||
      !map ||
      !place.geojson ||
      map.getLayer(`${place.uuid}-fill`)
    )
      return;
  }, [map, mapLoaded, place.geojson, place, activeLayers]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        layerSources,
        setLayerSources,
        manifestLabel: "combined",
      }}
    >
      <Suspense fallback={<HydrateFallback />}>
      <Await resolve={wpData}>
          {(resolvedWpData) => (
            <PlaceContent>
              <Heading
                as="h1"
                className="text-2xl px-4 pt-4 sticky top-0 z-10 bg-white"
              >
                {place.name}
              </Heading>
              <div className="relative -top-12 z-10 min-h-10">
                <FeaturedMedium record={place} />
              </div>
              <div
                className="relative px-4 -mt-12 primary-content"
                dangerouslySetInnerHTML={{
                  __html: resolvedWpData?.content.rendered ?? place.description,
                }}
              />
            </PlaceContent>
          )}
        </Await>
      </Suspense>
    </PlaceContext.Provider>
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
