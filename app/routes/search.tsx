import { useState } from "react";
import {
  InstantSearch,
  Hits,
  Pagination,
  HitsPerPage,
  // Menu,
} from "react-instantsearch";
import { searchClient } from "~/utils/typesense-adapter";
import Map from "~/components/Map.client";
import { ClientOnly } from "remix-utils/client-only";
import GeoSearch from "~/components/search/GeoSearch";
import type { Map as TMap } from "maplibre-gl";
import SearchForm from "~/components/search/SearchForm";
import SearchResult from "~/components/search/SearchResult";

const Search = () => {
  const [map, setMap] = useState<TMap | undefined>(undefined);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <InstantSearch
      indexName="gca"
      searchClient={searchClient}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="grid grid-cols-3 h-[calc(100vh-5rem)] overflow-hidden">
        <div className="col-span-1 overflow-auto">
          <SearchForm />
          {/* <Menu attribute="dc00ae2f-e12f-4bc8-934e-97bad18e5237.name_facet" /> */}
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
              <Map map={map} setMap={setMap} setMapLoaded={setMapLoaded} />
            )}
          </ClientOnly>
          <GeoSearch map={map} mapLoaded={mapLoaded} />
        </div>
      </div>
    </InstantSearch>
  );
};

export default Search;
