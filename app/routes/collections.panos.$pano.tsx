import { Link, useLoaderData } from "@remix-run/react";
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
    <div className="flex flex-col p-6">
      <Link
        to="/collections/panos"
        className="text-sm text-activeCounty underline hover:font-semibold"
      >
        Back to Pano Collection
      </Link>

      <iframe
        title={pano.uuid}
        src={pano.link}
        className="h-[66vh] bg-black/60 shadow-lg rounded-md"
        allowFullScreen
      />
      <div>
        <h1 className="text-lg text-black/85">{pano.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html:
              pano.description ??
              "Velit quis veniam commodo fugiat proident officia aute exercitation dolor duis amet non reprehenderit. Elit dolore ut Lorem dolore adipisicing nostrud cillum irure esse esse ipsum incididunt. In sunt laborum do aliqua magna veniam irure enim id officia. Est non qui commodo esse.",
          }}
        />
      </div>
    </div>
  );
};

export default PanoDetail;
