import { useLoaderData } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { ClientOnly } from "remix-utils/client-only";
import IIIFViewer from "~/components/layout/IIIFViewer.client";
import { photosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import Map from "~/components/mapping/Map.client";
import SharedMapOverlay from "~/components/collections/SharedMapOverlay";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Item from "~/components/collections/Item";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const photograph = await fetchBySlug(
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
    <Item itemType="photograph">
      <ClientOnly>{() => <IIIFViewer photo={photograph} />}</ClientOnly>

      <div>
        <h1 className="text-lg text-black/85">{photograph.name}</h1>

        {photograph.full_url && (
          <a
            href={photograph.full_url.replace("/square/", "/full/")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline hover:text-blue-800 mt-1 w-fit flex items-center"
          >
            View Full Image
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="text-sm ms-2"
            />
          </a>
        )}

        <div
          dangerouslySetInnerHTML={{
            __html: photograph.description ?? "",
          }}
        />
      </div>
      {photograph.places?.length > 0 && (
        <div className="mt-8 h-[500px] w-full rounded-md overflow-hidden">
          <ClientOnly>
            {() => (
              <Map className="w-96 h-96">
                <SharedMapOverlay places={photograph.places} />
              </Map>
            )}
          </ClientOnly>
        </div>
      )}
    </Item>
  );
};

export default PhotographDetail;
