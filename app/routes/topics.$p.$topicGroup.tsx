import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return { topic: params.topicGroup ?? "not found", params };
};
const TopicGroupPage = () => {
  const { topic } = useLoaderData<typeof loader>();
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
          {topic}
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48">
          Content coming soon...
        </p>
      </div>
    </section>
  );
};

export default TopicGroupPage;
