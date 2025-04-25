import { Link, useLoaderData } from "react-router";
import { photosIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import IIIFViewer from "~/components/layout/IIIFViewer.client";
import type { LoaderFunctionArgs } from "react-router";
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

      <IIIFViewer photo={photograph} />

      <div>
        <h1 className="text-lg text-black/85">{photograph.name}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html:
              photograph.description ??
              "Velit quis veniam commodo fugiat proident officia aute exercitation dolor duis amet non reprehenderit. Elit dolore ut Lorem dolore adipisicing nostrud cillum irure esse esse ipsum incididunt. In sunt laborum do aliqua magna veniam irure enim id officia. Est non qui commodo esse.",
          }}
        />
      </div>
    </div>
  );
};

export default PhotographDetail;
