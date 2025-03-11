import {
  Configure,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { searchRouter, videosIndexCollection } from "~/config";
import { videoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import PlaceFacets from "~/components/collections/PlaceFacets";
import VideoPreview from "~/components/collections/VideoPreview";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction } from "@remix-run/node";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <VideoCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const VideoCollection = ({ serverState, serverUrl }: SearchProps) => {
  return (
    <section>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          indexName={videosIndexCollection}
          searchClient={videoCollection}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={searchRouter(serverUrl)}
        >
          <Configure hitsPerPage={100} />
          <div className="flex flex-col md:flex-row items-end md:items-start mt-6 gap-4">
            <PlaceFacets />
            <div className="">
              <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2">
                Videos
              </h1>
              <Hits
                hitComponent={VideoPreview}
                classNames={{
                  root: "",
                  list: "flex md:block flex-col md:flex-none md:grid md:grid-cols-1 lg:grid-cols-3 md:pe-6",
                }}
              />
            </div>
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </section>
  );
};

const VideoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <div>
      <VideoCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default VideoCollectionIndex;
