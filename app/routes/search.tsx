import { useContext, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import {
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { searchClient } from "~/utils/elasticsearchAdapter";
import Map from "~/components/mapping/Map.client";
import { ClientOnly } from "remix-utils/client-only";
import GeoSearch from "~/components/search/GeoSearch";
import SearchForm from "~/components/search/SearchForm";
import { history } from "instantsearch.js/es/lib/routers";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { topBarHeight } from "~/config";
import { MapContext } from "~/contexts";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";
import SearchResults from "~/components/search/SearchResults.client";
import type { Map as TMap } from "maplibre-gl";
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
  location: any;
};

const Search = ({ serverState, serverUrl, location }: SearchProps) => {
  useEffect(() => {
    console.log("🚀 ~ Search ~ location:", location);
  }, [location]);
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
        <div
          className={`grid grid-cols-3 h-[calc(100vh-${topBarHeight})] overflow-hidden`}
        >
          <div className="col-span-1 overflow-auto">
            <SearchForm />
            <ClientOnly>{() => <SearchResults />}</ClientOnly>
          </div>
          <div className="col-span-2">
            <ClientOnly>
              {() => (
                <Map>
                  <StyleSwitcher />
                </Map>
              )}
            </ClientOnly>
            <GeoSearch />
          </div>
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
