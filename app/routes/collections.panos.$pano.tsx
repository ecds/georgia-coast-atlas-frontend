import { useLoaderData } from "@remix-run/react";
import { panosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import type { LoaderFunctionArgs } from "react-router";
import Map from "~/components/mapping/Map";
import SharedMapOverlay from "~/components/collections/SharedMapOverlay";
import { ClientOnly } from "remix-utils/client-only";
import Item from "~/components/collections/Item";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const pano = await fetchBySlug(params.pano, panosIndexCollection);

  if (!pano) {
    throw new Response(null, {
      status: 404,
      statusText: "Pano not found",
    });
  }

  return { pano };
};

const PanoDetail = () => {
  const { pano } = useLoaderData<typeof loader>();

  return (
    <Item itemType="pano">
      <iframe
        title={pano.uuid}
        src={pano.embed_url}
        className="h-[66vh] bg-black/60 shadow-lg rounded-md"
        allowFullScreen
      />
      <div>
        <h1 className="text-lg text-black/85">{pano.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: pano.description ?? "",
          }}
        />
      </div>
      {pano.places?.length > 0 && (
        <div className="mt-8 h-[500px] w-full rounded-md overflow-hidden">
          <ClientOnly>
            <Map className="w-96 h-96">
              <SharedMapOverlay places={pano.places} />
            </Map>
          </ClientOnly>
        </div>
      )}
    </Item>
  );
};

export default PanoDetail;
