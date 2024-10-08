import { useContext, useEffect, useRef, useState, Suspense } from "react";
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  defer,
} from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { islands, dataHosts, topBarHeight } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import Map from "~/components/mapping/Map.client";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import RelatedPlaces from "~/components/relatedRecords/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/relatedRecords/RelatedVideos";
import { PlaceContext, MapContext } from "~/contexts";
import RelatedPhotographs from "~/components/relatedRecords/RelatedPhotographs";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import RouteError from "~/components/errorResponses/RouteError";
import CodeError from "~/components/errorResponses/CodeError";
import Loading from "~/components/layout/Loading";
import type {
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
  TPlaceSource,
} from "~/types";
import RelatedMapLayers from "~/components/relatedRecords/RelatedMapLayers";
import RelatedTopoQuads from "~/components/relatedRecords/RelatedTopoQuads";
import Heading from "~/components/layout/Heading";
import PlaceGeoJSON from "~/components/mapping/PlaceGeoJSON";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const island = islands.find((i) => params.id == `${i.id}`);

  if (!island) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const place = await fetchPlaceRecord(island?.coreDataId);
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.id}-island`
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  return defer({ place, island, wpData: wpData[0] });
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<TIslandServerData>();
  const relatedRecords: TRelatedCoreDataRecords | {} =
    await fetchRelatedRecords(serverData.island.coreDataId);

  const geoJSON = toFeatureCollection([serverData.place]);

  return { ...serverData, ...relatedRecords, geoJSON };
};

clientLoader.hydrate = true;

export const HydrateFallback = () => {
  return <Loading />;
};

const IslandPage = () => {
  const { island, wpData, place, geoJSON, maps, ...related } =
    useLoaderData<TIslandClientData>();
  const { map, mapLoaded } = useContext(MapContext);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [layerSources, setLayerSources] = useState<TPlaceSource>({});
  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
    if (navigation.state === "loading") {
      if (map?.getLayer(`${island.id}-outline`))
        map.removeLayer(`${island.id}-outline`);
      if (map?.getLayer(`${island.id}-fill`))
        map.removeLayer(`${island.id}-fill`);
    }
  }, [navigation, island, map]);

  useEffect(() => {
    if (!mapLoaded || !map || !geoJSON || map.getLayer(`${island.id}-fill`))
      return;
  }, [map, mapLoaded, geoJSON, island, activeLayers]);

  return (
    <PlaceContext.Provider
      value={{
        place,
        activeLayers,
        setActiveLayers,
        geoJSON,
        layerSources,
        setLayerSources,
      }}
    >
      <div
        className={`flex flex-row overflow-hidden h-[calc(100vh-${topBarHeight})]`}
      >
        <div className="w-full md:w-1/2 lg:w-2/5 overflow-scroll pb-32">
          <div className="flex flex-col">
            <Heading
              as="h1"
              className="text-2xl px-4 pt-4 sticky top-0 z-10 bg-white"
            >
              {island.label} Island
            </Heading>
            <div ref={topRef} className="relative -top-12 z-10 min-h-10">
              <FeaturedMedium record={related} />
            </div>
            <div
              className="relative px-4 -mt-12 primary-content"
              dangerouslySetInnerHTML={{
                __html: wpData?.content.rendered ?? place.description,
              }}
            />
          </div>
          <Suspense fallback={<HydrateFallback />}>
            {related.places?.relatedPlaces && (
              <RelatedPlaces places={related.places.relatedPlaces} />
            )}
            {related.items?.videos && (
              <RelatedVideos videos={related.items.videos} />
            )}
            {related.media_contents?.photographs && (
              <RelatedPhotographs manifest={place.iiif_manifest} />
            )}
            {related.places?.mapLayers && (
              <RelatedMapLayers layers={related.places.mapLayers} />
            )}
            {related.places?.topoQuads && (
              <RelatedTopoQuads quads={related.places.topoQuads} />
            )}
            {geoJSON && <PlaceGeoJSON />}
          </Suspense>
        </div>
        <div className="hidden md:block w-1/2 lg:w-3/5">
          <ClientOnly>
            {() => (
              <Map>
                <StyleSwitcher></StyleSwitcher>
              </Map>
            )}
          </ClientOnly>
        </div>
      </div>
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