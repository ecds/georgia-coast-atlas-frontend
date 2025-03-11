import {
  Configure,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { panosIndexCollection, searchRouter } from "~/config";
import { panoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import PlaceFacets from "~/components/collections/PlaceFacets";
import PanoPreview from "~/components/collections/PanoPreview";
import CollectionList from "~/components/collections/CollectionList";
import CollectionItems from "~/components/collections/CollectionItems";
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
    <PanoCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const PanoCollection = ({ serverState, serverUrl }: SearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={panosIndexCollection}
        searchClient={panoCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} />
        <CollectionList>
          <PlaceFacets />
          <CollectionItems title="Panos">
            <Hits
              hitComponent={PanoPreview}
              classNames={{
                list: "flex md:block flex-col md:flex-none md:grid md:grid-cols-1 lg:grid-cols-3 md:pe-6",
              }}
            />
          </CollectionItems>
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PanoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <div>
      <PanoCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default PanoCollectionIndex;
