import { useContext, useEffect, useState } from "react";
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
import { defaultBounds, indexCollection } from "~/config";
import { MapContext } from "~/contexts";
import { getBB } from "~/utils/getBB";
import SearchResult from "~/components/search/SearchResult";
import type { LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from "react-instantsearch";
import SearchModal from "~/components/search/SearchModal";

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
  modalOpen?: boolean;
};

const Search = ({
  serverState,
  serverUrl,
  location,
  modalOpen,
}: SearchProps) => {
  const { map } = useContext(MapContext);
  const [hasQuery, setHasQuery] = useState<boolean>(false);

  useEffect(() => {
    setHasQuery(window.location.search !== "");
  }, [location]);

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
      <div
        className={`overflow-auto transition-all ${hasQuery ? "w-full md:max-w-1/2 lg:w-2/5" : "w-0"} bottom-36`}
      >
        {!modalOpen && (
          <InstantSearch
            indexName={indexCollection}
            searchClient={searchClient}
            future={{ preserveSharedStateOnUnmount: true }}
            routing={{
              router: history({
                getLocation() {
                  if (typeof window === "undefined") {
                    const urlToReturn = new URL(
                      serverUrl!
                    ) as unknown as Location;
                    return urlToReturn;
                  }
                  return window.location;
                },
                cleanUrlOnDispose: false,
              }),
            }}
          >
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
          </InstantSearch>
        )}
      </div>
    </InstantSearchSSRProvider>
  );
};

const SearchPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const location = useLocation();
  return (
    <>
      <SearchModal isOpen={modalOpen} setIsOpen={setModalOpen} />
      <Search
        modalOpen={modalOpen}
        serverState={serverState}
        serverUrl={serverUrl}
        location={location}
      />
    </>
  );
};

export default SearchPage;
