import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import MapPane from "~/components/MapPane.client";
import { islands, coreDataRelatedEndpoints, dataHosts } from "~/config.ts";
import type { CoreDataPlace, WordPressData } from "~/types";

export const loader = async ({ params }) => {
  const island = islands.find((i) => params.island == `${i.slug}-island`);

  if (!island) return { wpData: null, cdData: null };

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/pages/?slug=${params.island}`
  );

  const wpData: WordPressData = await wpResponse.json();

  const cdResponse = await fetch(
    `https://${dataHosts.coreData}/core_data/public/places/${island?.coreDataId}?project_ids=10`
  );
  const cdData: CoreDataPlace = await cdResponse.json();

  return { wpData: wpData[0], cdData, island } || null;
};

export const clientLoader = async ({ serverLoader }) => {
  const serverData = await serverLoader();
  for (const related of coreDataRelatedEndpoints) {
    const relatedResponse = await fetch(
      `https://${dataHosts.coreData}/core_data/public/places/${serverData.island.coreDataId}/${related.endpoint}?project_ids=10`
    );
    serverData[related.endpoint] = await relatedResponse.json();
  }
  return serverData;
};

clientLoader.hydrate = true;

const IslandPage = () => {
  const { wpData, cdData, ...related } = useLoaderData<typeof loader>();
  console.log("🚀 ~ IslandPage ~ related:", wpData, cdData, related);
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
        {cdData?.user_defined && (
          <table className="border-collapse table-fixed w-auto text-sm m-6">
            <tbody>
              {Object.keys(cdData.user_defined).map((ud) => {
                return (
                  <tr key={ud}>
                    <td className="px-2">{cdData.user_defined[ud].label}</td>
                    <td className="px-2">{cdData.user_defined[ud].value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="w-1/2">
        <ClientOnly>{() => <MapPane place={cdData} />}</ClientOnly>
      </div>
    </div>
  );
};

export default IslandPage;
