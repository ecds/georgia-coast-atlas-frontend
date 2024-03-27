import { useLoaderData, useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import MapPane from "~/components/MapPane.client";

export const loader = async ({ params }) => {
  const response = await fetch(
    `https://wp.georgiacoastatlas.org/wp-json/wp/v2/pages/?slug=${params.island}`
  );
  const data = await response.json();
  return data[0] || null;
};
const IslandPage = () => {
  const location = useLocation();
  const wpContent = useLoaderData<typeof loader>(location);
  return (
    <div className="flex flex-row overflow-hidden h-[calc(100vh-5rem)]">
      <div className="basis-1/2 overflow-scroll">
        <h1 className="text-2xl my-2 p-4 sticky top-0 bg-white z-10">
          {wpContent.title.rendered}
        </h1>
        <div
          className="relative p-4"
          dangerouslySetInnerHTML={{
            __html: wpContent.content.rendered,
          }}
        />
      </div>
      <div className="basis-1/2">
        <ClientOnly>{() => <MapPane />}</ClientOnly>
      </div>
    </div>
  );
};

export default IslandPage;
