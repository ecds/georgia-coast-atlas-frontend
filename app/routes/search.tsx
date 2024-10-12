import { useContext, useEffect } from "react";
import { renderToString } from "react-dom/server";
import {
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { searchClient } from "~/utils/elasticsearchAdapter";
import { ClientOnly } from "remix-utils/client-only";
import GeoSearch from "~/components/search/GeoSearch";
import SearchForm from "~/components/search/SearchForm";
import { history } from "instantsearch.js/es/lib/routers";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { defaultBounds } from "~/config";
import { MapContext } from "~/contexts";
import SearchResults from "~/components/search/SearchResults.client";
import type { LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from "react-instantsearch";
import { getBB } from "~/utils/getBB";

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
        <div className="overflow-auto w-full md:max-w-1/2 lg:w-2/5">
          <SearchForm />
          <ClientOnly>{() => <SearchResults />}</ClientOnly>
          <GeoSearch />
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
