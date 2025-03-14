import { useContext, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import {
  Configure,
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
import { MapContext, SearchContext } from "~/contexts";
import { getBB } from "~/utils/getBB";
import SearchResult from "~/components/search/SearchResult";
import SearchModal from "~/components/search/SearchModal";
import type { ReactNode } from "react";
import type { LoaderFunction } from "@remix-run/node";
import type { Navigation, Location } from "@remix-run/react";
import type { InstantSearchServerState } from "react-instantsearch";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { fetchPlacesByType, fetchCounties } from "~/data/coredata";
import type { ESPlace } from "~/esTypes";
import Islands from "~/components/mapping/Islands";
import Counties from "~/components/mapping/Counties";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
  navigation?: Navigation;
  children?: ReactNode;
  islands: ESPlace[]; 
  counties: ESPlace[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} islands={[]} counties={[]} />, {
    renderToString,
  });

  const islands = await fetchPlacesByType("Barrier Island"); 
  const counties = await fetchCounties(); 

  return {
    serverState,
    serverUrl,
    islands,
    counties,
  };
};

const Search = ({
  serverState,
  serverUrl,
  location,
  navigation,
  children,
  islands,
  counties,
}: SearchProps) => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (navigation?.state === "idle" && location?.search && map) {
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
        className={`overflow-auto transition-all w-full md:w-2/3 lg:w-2/5 bottom-36`}
      >
        <InstantSearch
          indexName={indexCollection}
          searchClient={searchClient}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={{
            router: history({
              /* @ts-expect-error This seems to be a bug in */
              getLocation() {
                if (typeof window === "undefined") {
                  const urlToReturn = new URL(
                    /* @ts-expect-error Not sure what more we can do here */
                    serverUrl
                  ) as unknown as Location;
                  return urlToReturn;
                }
                return window.location;
              },
              cleanUrlOnDispose: false,
            }),
          }}
        >
          <Configure hitsPerPage={500} />
          {children}
          <TabGroup>
            <TabList className="w-full overflow-hidden flex sticky top-0 bg-county/40 mx-auto">
              <Tab className="flex-grow py-3 px-3 text-lg tracking-wide font-semibold text-black data-[selected]:text-white hover:text-white focus:outline-none data-[selected]:bg-county data-[hover]:bg-county/75 data-[selected]:data-[hover]:bg-county data-[focus]:outline-1 data-[focus]:outline-black">
                Search
              </Tab>
              <Tab className="flex-grow py-3 px-3 text-lg tracking-wide font-semibold text-black data-[selected]:text-white hover:text-white focus:outline-none data-[selected]:bg-county data-[hover]:bg-county/75 data-[selected]:data-[hover]:bg-county data-[focus]:outline-1 data-[focus]:outline-black">
                Explore
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SearchForm />
                <Hits hitComponent={SearchResult} className="" />
                {/* <InfiniteHits hitComponent={SearchResult} /> */}
                <GeoSearch />
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
              </TabPanel>
              <TabPanel>
                <h3 className="mx-6 text-xl font-semibold">Islands</h3>
                  <ul className="mx-6">
                    {islands.length > 0 ? (
                      islands.map((island) => (
                        <li key={island.uuid} className="py-2">
                          <a
                            href={`/islands/${island.slug}`}
                            className="text-black hover:text-blue-800"
                          >
                            {island.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <p className="mx-6 text-gray-500">No islands available.</p>
                    )}
                  </ul>

                  <div className="relative h-96 w-full">
                    <Islands islands={islands} />
                  </div>

                  <h3 className="mx-6 text-xl font-semibold mt-4">Counties</h3>
                  <ul className="mx-6">
                    {counties.length > 0 ? (
                      counties.map((county) => (
                        <li key={county.slug} className="py-2">
                          <a
                            href={`/counties/${county.slug}`}
                            className="text-black hover:text-blue-800"
                          >
                            {county.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <p className="mx-6 text-gray-500">No counties available.</p>
                    )}
                </ul>
                <div className="relative h-96 w-full">
                  <Counties counties={counties} />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </InstantSearch>
      </div>
    </InstantSearchSSRProvider>
  );
};

const SearchPage = () => {
  const { serverState, serverUrl, islands, counties} = useLoaderData() as SearchProps;
  const [activeResult, setActiveResult] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigation = useNavigation();
  return (
    <SearchContext.Provider value={{ activeResult, setActiveResult }}>
      <Search
        modalOpen={modalOpen}
        serverState={serverState}
        serverUrl={serverUrl}
        location={location}
        navigation={navigation}
        islands={islands}
        counties={counties}
      >
        <SearchModal isOpen={modalOpen} setIsOpen={setModalOpen} />
      </Search>
    </SearchContext.Provider>
  );
};

export default SearchPage;
