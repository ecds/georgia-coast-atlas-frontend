import { useLoaderData } from "@remix-run/react";
import { collectionPrefix } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Item from "~/components/collections/Item";
import Heading from "~/components/layout/Heading";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { mediaType, slug } = params;
  const medium = await fetchBySlug(slug, `${collectionPrefix}_${mediaType}`);

  return { medium };
};

const Component = () => {
  const { medium } = useLoaderData<typeof loader>();

  switch (medium.media_type) {
    case "video":
      return (
        <Item>
          <div className="relative pb-[56.2%] h-0 overflow-hidden max-w-full">
            <iframe
              title={medium.uuid}
              src={medium.embed_url}
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full bg-black/60"
            />
          </div>
          <Heading as="h1">{medium.name}</Heading>
          <div className="mx-16 mt-8">
            <div>
              <Heading as="h2">Transcript:</Heading>
              <div
                className="font-light leading-loose tracking-wide"
                dangerouslySetInnerHTML={{
                  __html: medium.transcript ?? "",
                }}
              />
            </div>
          </div>
        </Item>
      );

    default:
      return null;
  }

  return <></>;
};

export default Component;
