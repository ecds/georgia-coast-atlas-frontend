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

const TopicMediumItemRoute = () => {
  const { medium } = useLoaderData<typeof loader>();

  switch (medium.media_type) {
    case "video":
      return (
        <Item className="grid grid-cols-3 mx-2 md:mx-6 lg:mx-12 xl:mx-16">
          <div className="col-span-3">
            <div className="w-3/4 mx-auto">
              <iframe
                title={medium.uuid}
                src={medium.embed_url}
                allowFullScreen
                className="w-full aspect-video bg-black/60"
              />
              <Heading
                as="h1"
                className="col-span-3 text-lg md:text-xl mt-2 overflow-hidden text-ellipsis text-nowrap md:overflow-visible md:text-wrap"
              >
                {medium.name}
              </Heading>
            </div>
          </div>
          <div className="mt-8 col-span-3">
            <div className="w-3/4 mx-auto">
              <Heading as="h2" className="text-lg">
                Transcript:
              </Heading>
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

export default TopicMediumItemRoute;
