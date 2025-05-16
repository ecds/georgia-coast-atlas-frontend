import { useLoaderData } from "react-router";
import { dataHosts, topicIndexCollection } from "~/config";
import { fetchBySlug } from "~/data/coredata";
import Heading from "~/components/layout/Heading";
import Thumbnails from "~/components/topics/Thumbnails";
import RelatedPlaces from "~/components/topics/RelatedPlaces";
import type { LoaderFunctionArgs } from "react-router";
import type { TWordPressData } from "~/types";
import type { ESTopic } from "~/esTypes";

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
      <RelatedPlaces topic={topic} />
      <Thumbnails topic={topic.name} items={topic.videos} mediaType="videos" />
      <Thumbnails
        topic={topic.name}
        items={topic.photographs}
        mediaType="photographs"
      />
      <Thumbnails topic={topic.name} items={topic.panos} mediaType="panos" />
    </div>
  );
};

export default TopicGroupPage;
