import { useState } from "react";
import { renderToString } from "react-dom/server";
import {
  Configure,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  getServerState,
} from "react-instantsearch";
import { useLoaderData, useLocation, useNavigation } from "react-router";
import { history as searchHistory } from "instantsearch.js/es/lib/routers";
import { allPlacesSearchClient } from "~/utils/elasticsearchAdapter";
import GeoSearch from "~/components/search/GeoSearch";
import SearchForm from "~/components/search/SearchForm";
import { indexCollection } from "~/config";
import { SearchContext } from "~/contexts";
import SearchResult from "~/components/search/SearchResult";
import { pageMetaDefaults } from "~/utils/pageMetadata";
// import SearchModal from "~/components/search/SearchModal";
import type { LoaderFunction } from "react-router";
import type { Navigation, Location, MetaFunction } from "react-router";
import type { InstantSearchServerState } from "react-instantsearch";

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
      ...pageMetaDefaults,
      title: "Search: Georgia Coast Atlas",
    },
  ];
};

const Search = ({ serverState, serverUrl, location }: SearchProps) => {
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
        <Configure hitsPerPage={500} />
        <SearchForm />
        <Hits hitComponent={SearchResult} />
        {/* <InfiniteHits hitComponent={SearchResult} /> */}
        <GeoSearch location={location} />
        <div className="h-16"></div>
        <Pagination
          classNames={{
            root: "px-2 py-4 fixed bottom-0 bg-white w-full md:w-2/3 lg:w-2/5",
            list: "flex flex-row items-stretch justify-center",
            pageItem:
              "bg-county/70 text-white mx-4 text-center rounded-md min-w-6 max-w-8",
            selectedItem: "bg-county text-white",
          }}
          padding={2}
        />
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PlacesSearchPage = () => {
  const { serverState, serverUrl, view } = useLoaderData() as SearchProps;
  const [activeResult, setActiveResult] = useState<string | undefined>();
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <SearchContext.Provider value={{ activeResult, setActiveResult }}>
      <Search
        // modalOpen={modalOpen}
        serverState={serverState}
        serverUrl={serverUrl}
        location={location}
        navigation={navigation}
        view={view}
      />
    </SearchContext.Provider>
  );
};

export default PlacesSearchPage;
