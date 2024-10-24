import { useContext, useEffect } from "react";
import { renderToString } from "react-dom/server";
import {
  Hits,
  // InfiniteHits,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  getServerState,
} from "react-instantsearch";
import { searchClient } from "~/utils/elasticsearchAdapter";
import GeoSearch from "~/components/search/GeoSearch";
import SearchForm from "~/components/search/SearchForm";
import { history } from "instantsearch.js/es/lib/routers";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { defaultBounds } from "~/config";
import { MapContext } from "~/contexts";
import { getBB } from "~/utils/getBB";
import SearchResult from "~/components/search/SearchResult";
import type { LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from "react-instantsearch";

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  return json({
    serverState,
    serverUrl,
  });
};

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: any;
};

const Search = ({ serverState, serverUrl, location }: SearchProps) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (location.search && map) {
      const previousBounds = getBB(location.search);
      if (previousBounds) {
        map.fitBounds(previousBounds);
      }
    } else {
      map?.fitBounds(defaultBounds());
    }
  }, [location, map]);

  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName="georgia_coast"
        searchClient={searchClient}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={{
          router: history({
            getLocation() {
              if (typeof window === "undefined") {
                const urlToReturn = new URL(serverUrl!) as unknown as Location;
                return urlToReturn;
              }
              return window.location;
            },
            cleanUrlOnDispose: false,
          }),
        }}
      >
        <div className="overflow-auto w-full md:max-w-1/2 lg:w-2/5 bottom-36">
          <SearchForm />
          <Hits hitComponent={SearchResult} className="" />
          {/* <InfiniteHits hitComponent={SearchResult} /> */}
          <GeoSearch />
          <div className="h-16"></div>
          <Pagination
            classNames={{
              root: "w-full, px-2 py-4 fixed bottom-0 bg-white md:max-w-1/2 lg:w-2/5",
              list: "flex flex-row width-full items-stretch justify-center",
              pageItem:
                "bg-blue-400 text-blue-100 mx-4 text-center rounded-md min-w-6 max-w-8",
              selectedItem: "bg-blue-800 text-blue-100",
            }}
            padding={2}
          />
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const SearchPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;
  const location = useLocation();
  return (
    <Search
      serverState={serverState}
      serverUrl={serverUrl}
      location={location}
    />
  );
};

export default SearchPage;
