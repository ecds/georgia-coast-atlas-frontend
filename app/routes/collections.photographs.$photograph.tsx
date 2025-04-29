import { Link, useLoaderData } from "@remix-run/react";
import { photosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import IIIFViewer from "~/components/layout/IIIFViewer.client";
import { ClientOnly } from "remix-utils/client-only";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ESPhotographItem } from "~/esTypes";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const photograph: ESPhotographItem = await fetchBySlug(
    params.photograph,
    photosIndexCollection
  );

  if (!photograph) {
    throw new Response(null, {
      status: 404,
      statusText: "Photograph not found",
    });
  }

  return { photograph };
};

const PhotographDetail = () => {
  const { photograph } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col p-6">
      <Link
        to="/collections/photographs"
        className="text-sm text-activeCounty underline hover:font-semibold"
      >
        Back to Photograph Collection
      </Link>

      <ClientOnly>{() => <IIIFViewer photo={photograph} />}</ClientOnly>

      <div>
        <h1 className="text-lg text-black/85">{photograph.name}</h1>
        // Add link here
        <div
          dangerouslySetInnerHTML={{
            __html:
              photograph.description ??
              "",
          }}
        />
      </div>
    </div>
  );
};

export default PhotographDetail;
