import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { searchRouter, videosIndexCollection } from "~/config";
import { videoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "react-router";
import CollectionList from "~/components/collections/CollectionList";
import PlaceFacets from "~/components/collections/PlaceFacets";
import Thumbnails from "~/components/collections/Thumbnails";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction } from "react-router";

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
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={videosIndexCollection}
        searchClient={videoCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} />
        <CollectionList>
          <PlaceFacets />
          <Thumbnails collectionType="videos" />
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
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
