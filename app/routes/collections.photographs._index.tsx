import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { useLoaderData } from "react-router";
import { photosIndexCollection, searchRouter } from "~/config";
import { photoCollection } from "~/utils/elasticsearchAdapter";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import type { LoaderFunction } from "react-router";
import type { ESSearchProps } from "~/esTypes";

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <PhotographCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const PhotographCollection = ({ serverState, serverUrl }: ESSearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={photosIndexCollection}
        searchClient={photoCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={24} />
        <CollectionList>
          <PlaceFacets />
          <Thumbnails collectionType="photographs" />
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PhotographCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;

  return (
    <div>
      <PhotographCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default PhotographCollectionIndex;
