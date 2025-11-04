import { useState } from "react";
import { renderToString } from "react-dom/server";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { useLoaderData, useLocation, useNavigation } from "react-router";
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
import type {
  Navigation,
  LoaderFunction,
  Location,
  MetaFunction,
} from "react-router";

type views = "search" | "explore";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
  navigation?: Navigation;
  view?: views;
};

const views: views[] = ["search", "explore"];

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  const url = new URL(request.url);
  const view = url.searchParams.get("view");

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
              let urlToReturn = undefined;
              if (typeof window === "undefined" && serverUrl) {
                urlToReturn = new URL(serverUrl);
              } else {
                urlToReturn = new URL(window.location.toString());
              }
              return urlToReturn;
            },
            cleanUrlOnDispose: false,
          }),
        }}
      >
        <Configure hitsPerPage={100} />
        <div className="grid grid-cols-5 sticky top-0">
          <div className="col-span-4">
            <Autocomplete />
          </div>
          <div className="col-span-1 py-4 pe-4">
            <FacetMenu />
          </div>
          <div className="col-span-5">
            <ClientOnly>
              <GeoToggle />
            </ClientOnly>
          </div>
          <div className="col-span-5 border-b-2">
            <CurrentRefinements />
          </div>
          <div className="col-span-5 flex-1 overflow-y-scroll">
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
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <SearchContext.Provider value={{ activeResult, setActiveResult }}>
      <Search
        serverState={serverState}
        serverUrl={serverUrl}
        location={location}
        navigation={navigation}
        view={view}
      />
    </SearchContext.Provider>
  );
};

export default PlacesIndex;
