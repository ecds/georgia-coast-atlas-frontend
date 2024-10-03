import { useState } from "react";
import { renderToString } from "react-dom/server";
import {
  InstantSearch,
  Hits,
  Pagination,
  HitsPerPage,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { searchClient } from "~/utils/typesense-adapter";
import Map from "~/components/mapping/Map.client";
import { ClientOnly } from "remix-utils/client-only";
import GeoSearch from "~/components/search/GeoSearch";
import type { Map as TMap } from "maplibre-gl";
import SearchForm from "~/components/search/SearchForm";
import SearchResult from "~/components/search/SearchResult";
import { history } from "instantsearch.js/es/lib/routers";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { topBarHeight } from "~/config";
import { MapContext } from "~/contexts";
import type { LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from "react-instantsearch";
import StyleSwitcher from "~/components/mapping/StyleSwitcher";

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
};

const Search = ({ serverState, serverUrl }: SearchProps) => {
  console.log("🚀 ~ Search ~ serverState:", serverState);
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <InstantSearchSSRProvider {...serverState}>
      <MapContext.Provider
        value={{
          map,
          setMap,
          mapLoaded,
          setMapLoaded,
        }}
      >
        <InstantSearch
          indexName="gca"
          searchClient={searchClient}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={{
            router: history({
              getLocation() {
                if (typeof window === "undefined") {
                  return new URL(serverUrl!) as unknown as Location;
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
              <Hits
                hitComponent={SearchResult}
                classNames={{ root: "px-8 overflow-auto" }}
              />
              <Pagination
                className="mt-4"
                classNames={{
                  list: "flex flex-row items-stretch w-full py-1 px-4",
                  item: "grow bg-blue-100 text-blue-800 text-xs font-medium mx-2 px-2.5 py-0.5 rounded text-center",
                }}
              />
              <HitsPerPage
                className="p-4 mb-4"
                items={[
                  { label: "25 results per page", value: 25, default: true },
                  { label: "50 results per page", value: 50 },
                  { label: "100 results per page", value: 100 },
                  { label: "150 results per page", value: 150 },
                  { label: "200 results per page", value: 200 },
                  { label: "250 results per page", value: 250 },
                ]}
                title="Results per page"
                classNames={{
                  select:
                    "bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded",
                }}
              />
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
      </MapContext.Provider>
    </InstantSearchSSRProvider>
  );
};

const SearchPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;
  return <Search serverState={serverState} serverUrl={serverUrl} />;
};

export default SearchPage;
