import {
  Configure,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { mapIndexCollection, searchRouter } from "~/config";
import { mapCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import MapPreview from "~/components/collections/MapPreview";
import PlaceFacets from "~/components/collections/PlaceFacets";
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
    <MapCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const MapCollection = ({ serverState, serverUrl }: SearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={mapIndexCollection}
        searchClient={mapCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} />
        {/* <SortBy
            items={[{ label: "Year", value: "instant_search_year_asc" }]}
          /> */}
        <CollectionList>
          <PlaceFacets />
          <CollectionItems title="Maps">
            <Hits
              hitComponent={MapPreview}
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

const MapCollectionPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <div>
      <MapCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default MapCollectionPage;
