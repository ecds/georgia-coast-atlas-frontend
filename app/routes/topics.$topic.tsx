import { useLoaderData } from "@remix-run/react";
import { dataHosts, topicIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import Heading from "~/components/layout/Heading";
import Thumbnails from "~/components/topics/Thumbnails";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { TWordPressData } from "~/types";
import type { ESTopic } from "~/esTypes";
import TopicMap from "~/components/topics/TopicMap";
import RelatedPlacesDetailedList from "~/components/relatedRecords/RelatedPlacesDetailedList";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const topic: ESTopic = await fetchBySlug(params.topic, topicIndexCollection);

  if (!topic || !topic.wordpress_id) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const wpResponse = await fetch(
    `https://${dataHosts.wordPress}/wp-json/wp/v2/posts/${topic.wordpress_id}`
  );

  let wpData: TWordPressData | undefined = undefined;

  const data = await wpResponse.json();
  if (wpResponse.status === 200 && data.length > 0) {
    wpData = data[0];
  }

  return { topic, wpData };
};

const TopicGroupPage = () => {
  const { topic, wpData } = useLoaderData<typeof loader>();
  console.log("🚀 ~ TopicGroupPage ~ topic:", topic);
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-20">
      <Heading
        as="h1"
        className="mb-4 text-center text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl"
      >
        {topic.name}
      </Heading>
      <div
        className={`relative px-4 primary-content`}
        dangerouslySetInnerHTML={{
          __html: wpData?.content.rendered ?? "",
        }}
      />
      {topic.places && (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-9 mb-12 md:gap-2 lg:gap-4">
          <Heading
            as="h2"
            className="text-2xl capitalize col-span-1 md:col-span-6 lg:col-span-9"
          >
            Places
          </Heading>
          <div className="rounded-lg bg-county/25 md:col-span-2 lg:col-span-3 mb-8 md:mb-0">
            <RelatedPlacesDetailedList
              places={topic.places}
              className="h-[66vh]"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg md:col-span-4 lg:col-span-6">
            <TopicMap topic={topic} className="h-[66vh]" />
          </div>
        </div>
      )}
      <Thumbnails items={topic.videos} mediaType="videos" />
    </div>
  );
};

export default TopicGroupPage;
