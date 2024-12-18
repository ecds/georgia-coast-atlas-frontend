import { useContext, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import {
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  getServerState,
} from "react-instantsearch";
import { searchClient } from "~/utils/elasticsearchAdapter";
import GeoSearch from "~/components/search/GeoSearch";
import SearchForm from "~/components/search/SearchForm";
import { history } from "instantsearch.js/es/lib/routers";
import { useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import { defaultBounds, indexCollection } from "~/config";
import { MapContext } from "~/contexts";
import { getBB } from "~/utils/getBB";
import SearchResult from "~/components/search/SearchResult";
import SearchModal from "~/components/search/SearchModal";
import type { ReactNode } from "react";
import type { LoaderFunction } from "@remix-run/node";
import type { Navigation } from "@remix-run/react";
import type { InstantSearchServerState } from "react-instantsearch";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: any;
  modalOpen?: boolean;
  navigation?: Navigation;
  children?: ReactNode;
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  return {
    serverState,
    serverUrl,
  };
};

const Search = ({
  serverState,
  serverUrl,
  location,
  navigation,
  children,
}: SearchProps) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (navigation?.state === "idle" && location.search && map) {
      const previousBounds = getBB(location.search);
      if (previousBounds) {
        map.fitBounds(previousBounds);
      }
    } else {
      map?.fitBounds(defaultBounds());
    }
  }, [location, map, navigation]);

  return (
    <InstantSearchSSRProvider {...serverState}>
      <div
        className={`overflow-auto transition-all w-full md:max-w-1/2 lg:w-2/5 bottom-36`}
      >
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
          {children}
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
      </div>
    </InstantSearchSSRProvider>
  );
};

const SearchPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigation = useNavigation();
  return (
    <Search
      modalOpen={modalOpen}
      serverState={serverState}
      serverUrl={serverUrl}
      location={location}
      navigation={navigation}
    >
      <SearchModal isOpen={modalOpen} setIsOpen={setModalOpen} />
    </Search>
  );
};

export default SearchPage;
