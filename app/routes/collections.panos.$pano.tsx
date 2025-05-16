import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { panosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import Map from "~/components/mapping/Map.client";
import SharedMapOverlay from "~/components/collections/SharedMapOverlay";
import ClientOnly from "~/components/ClientOnly";
import Item from "~/components/collections/Item";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import type { LoaderFunctionArgs } from "react-router";
import type { ESCollectionItem } from "~/esTypes";

export const meta = ({ data }: { data: { pano: ESCollectionItem } }) => {
  const { pano } = data;

  const previewImage = pano.thumbnail_url.replace("!250,250", "!1200,630");

  return collectionMetadata({
    title: pano.title ?? pano.name,
    description: pano.description ?? "A panorama from the Georgia Coast Atlas.",
    image: previewImage,
    slug: `pano/${pano.slug}`,
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const pano = await fetchBySlug(params.pano, panosIndexCollection);

  if (!pano) {
    throw new Response(null, { status: 404, statusText: "Pano not found" });
  }

  return { pano };
};

const PanoDetail = () => {
  const { pano } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const [backTo, setBackTo] = useState("Back to Panos Collectin");

  useEffect(() => {
    if (!location.state.backTo) return;
    setBackTo(location.state.backTo);
  }, [location]);

  return (
    <Item>
      <button
        className="text-sm text-activeCounty underline hover:font-semibold self-start capitalize"
        onClick={() => navigate(-1)}
      >
        {backTo}
      </button>
      <iframe
        title={pano.uuid}
        src={pano.embed_url}
        className="h-[66vh] bg-black/60 shadow-lg rounded-md"
        allowFullScreen
      />
      <div>
        <h1 className="text-lg text-black/85">{pano.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: pano.description ?? "" }} />
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
