import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import MapPane from "~/components/MapPane.client";
import { islands, dataHosts } from "~/config.ts";
import { fetchPlaceRecord, fetchRelatedRecords } from "~/data/coredata";
import type { TCoreDataPlace, WordPressData } from "~/types";

export const loader = async ({ params }) => {
  const island = islands.find((i) => params.island == `${i.slug}-island`);

  if (!island) return { wpData: null, place: null };

  const cdData: TCoreDataPlace = await fetchPlaceRecord(island?.coreDataId);

  return { place: cdData.place, island } || null;
};

export const clientLoader = async ({ params, serverLoader }) => {
  const serverData = await serverLoader();
  const relatedRecords = await fetchRelatedRecords(
    serverData.island.coreDataId,
  );
  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.island}`,
  );

  const wpData: WordPressData = await wpResponse.json();

  return { ...serverData, ...relatedRecords, wpData: wpData[0] };
};

clientLoader.hydrate = true;

const IslandPage = () => {
  const { wpData, place, ...related } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-row overflow-hidden h-[calc(100vh-5rem)]">
      <div className="w-1/2 overflow-scroll">
        <h1 className="text-2xl my-2 p-4 sticky top-0 bg-white z-10">
          {wpData?.title.rendered}
        </h1>
        <div
          className="relative p-4"
          dangerouslySetInnerHTML={{
            __html: wpData?.content.rendered,
          }}
        />

        <div className="flex flex-wrap justify-around">
          {related.media_contents?.photographs && (
            <>
              {related.media_contents.photographs.map((photo) => {
                return (
                  <img
                    key={photo.name}
                    src={photo.content_thumbnail_url}
                    alt=""
                    className="p-8"
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="w-1/2">
        <ClientOnly>{() => <MapPane record={place} />}</ClientOnly>
      </div>
    </div>
  );
};

export default IslandPage;
