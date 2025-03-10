import { useLoaderData } from "@remix-run/react";
import { panosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import type { LoaderFunctionArgs } from "@remix-run/node";

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
    <iframe
      title={pano.uuid}
      src={pano.link}
      className="w-screen h-topOffset"
    />
  );
};

export default PanoDetail;
