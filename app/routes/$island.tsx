import { useEffect, useRef } from "react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { islands, dataHosts } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import IIIFPhoto from "~/components/IIIFPhoto.client";
import Map from "~/components/Map.client";
import { toFeatureCollection } from "~/utils/toFeatureCollection";
import RelatedPlaces from "~/components/RelatedPlaces";
import FeaturedMedium from "~/components/FeaturedMedium";
import RelatedVideos from "~/components/RelatedVideos";
import type {
  TCoreDataPlace,
  TWordPressData,
  TIslandServerData,
  TIslandClientData,
  TRelatedCoreDataRecords,
} from "~/types";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const island = islands.find((i) => params.island == `${i.slug}-island`);

  if (!island) return { wpData: null, place: null };

  const cdData: TCoreDataPlace = await fetchPlaceRecord(island?.coreDataId);

  return { place: cdData?.place, island } || null;
};

export const clientLoader = async ({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<TIslandServerData>();
  const relatedRecords: TRelatedCoreDataRecords = await fetchRelatedRecords(
    serverData.island.coreDataId,
  );
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.island}`,
  );

  const wpData: TWordPressData[] = await wpResponse.json();

  const geoJSON = relatedRecords.places?.relatedPlaces
    ? toFeatureCollection([
        serverData.place,
        ...relatedRecords.places.relatedPlaces,
      ])
    : toFeatureCollection([serverData.place]);

  return { ...serverData, ...relatedRecords, wpData: wpData[0], geoJSON };
};

clientLoader.hydrate = true;

const IslandPage = () => {
  const { island, wpData, place, geoJSON, ...related } =
    useLoaderData<TIslandClientData>();

  const topRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") topRef.current?.scrollIntoView();
  }, [navigation]);

  return (
    <div className="flex flex-row overflow-hidden h-[calc(100vh-5rem)]">
      <div className="w-1/2 overflow-scroll pb-32">
        <div className="flex flex-col">
          <h1 className="text-2xl px-4 pt-4 sticky top-0 bg-white z-10">
            {island.label} Island
          </h1>
          <div ref={topRef} className="relative -top-12 z-50 bg-black">
            <FeaturedMedium record={related} />
          </div>
          <div
            className="relative px-4 -mt-12"
            dangerouslySetInnerHTML={{
              __html: wpData?.content.rendered,
            }}
          />
        </div>

        {related.places?.relatedPlaces && (
          <RelatedPlaces places={related.places.relatedPlaces} />
        )}

        {related.items?.videos && (
          <RelatedVideos videos={related.items.videos} />
        )}

        {related.media_contents?.photographs && (
          <div className="flex flex-wrap justify-around">
            {related.media_contents?.photographs && (
              <>
                {related.media_contents.photographs.map((photo) => {
                  return (
                    <img
                      key={photo.name}
                      src={photo.content_thumbnail_url}
                      alt=""
                      className="p-8 drop-shadow-md"
                    />
                  );
                })}
              </>
            )}
            <ClientOnly>
              {() => <IIIFPhoto manifestURL={place.iiif_manifest} />}
            </ClientOnly>
          </div>
        )}
      </div>
      <div className="w-1/2">
        <ClientOnly>{() => <Map geoJSON={geoJSON} />}</ClientOnly>
      </div>
    </div>
  );
};

export default IslandPage;
