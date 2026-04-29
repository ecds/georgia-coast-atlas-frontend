import { useState } from "react";
import { renderToString } from "react-dom/server";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { useLoaderData } from "react-router";
import { history as searchHistory } from "instantsearch.js/es/lib/routers";
import { allPlacesSearchClient } from "~/utils/elasticsearchAdapter";
import { indexCollection } from "~/config";
import { SearchContext } from "~/contexts";
import { placeMetaDefaults } from "~/utils/placeMetaTags";
import { Autocomplete } from "~/components/search/AutoComplete";
import SearchResults from "~/components/search/SearchResults";
import FacetMenu from "~/components/search/FacetMenu";
import CurrentRefinements from "~/components/search/CurrentRefinements";
import GeoToggle from "~/components/search/GeoToggle.client";
import ClientOnly from "~/components/ClientOnly";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction, MetaFunction } from "react-router";

type views = "search" | "explore";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  view?: views | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  const url = new URL(request.url);
  const view = url.searchParams.get("view") as views | null;

  return {
    serverState,
    serverUrl,
    view,
  };
};

export const meta: MetaFunction = () => {
  return [
    {
      ...placeMetaDefaults,
      title: "Search: Georgia Coast Atlas",
    },
  ];
};

const Search = ({ serverState, serverUrl }: SearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={indexCollection}
        searchClient={allPlacesSearchClient}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={{
          router: searchHistory({
            /* @ts-expect-error This seems to be a bug in */
            getLocation() {
              if (typeof window === "undefined" && serverUrl) {
                return new URL(serverUrl);
              }

              return new URL(window.location.toString());
            },
            cleanUrlOnDispose: false,
          }),
        }}
      >
        <Configure hitsPerPage={100} />

        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
          <div className="shrink-0 border-b border-black/10 bg-white">
            <div className="grid grid-cols-5 items-center gap-2 px-2 pt-2 pb-1">
              <div className="col-span-4">
                <Autocomplete />
              </div>

              <div className="col-span-1 ps-2">
                <FacetMenu />
              </div>

              <div className="col-span-5 pt-2">
                <ClientOnly>
                  <GeoToggle />
                </ClientOnly>
              </div>

              <div className="col-span-5 border-t border-black/10 pt-2">
                <CurrentRefinements />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white/95">
            <SearchResults />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PlacesIndex = () => {
  const { serverState, serverUrl, view } = useLoaderData() as SearchProps;
  const [activeResult, setActiveResult] = useState<string | undefined>();

  return (
    <SearchContext.Provider value={{ activeResult, setActiveResult }}>
      <Search
        serverState={serverState}
        serverUrl={serverUrl}
        view={view}
      />
    </SearchContext.Provider>
  );
};

export default PlacesIndex;