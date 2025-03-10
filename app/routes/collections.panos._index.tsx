import {
  Configure,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  // Pagination,
  RefinementList,
  // SearchBox,
  getServerState,
  // useRefinementList,
} from "react-instantsearch";
import { history } from "instantsearch.js/es/lib/routers";
import { renderToString } from "react-dom/server";
import { panosIndexCollection } from "~/config";
import { panoCollection } from "~/utils/elasticsearchAdapter";
import { Link, useLoaderData } from "@remix-run/react";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction } from "@remix-run/node";
import type { Hit } from "instantsearch.js";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
};

const PanoPreview = ({ hit }: { hit: Hit }) => {
  return <Link to={`/collections/panos/${hit.slug}`}>{hit.name}</Link>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <PanoCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const PanoCollection = ({ serverState, serverUrl }: SearchProps) => {
  return (
    <section>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          indexName={panosIndexCollection}
          searchClient={panoCollection}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={{
            router: history({
              getLocation() {
                if (typeof window === "undefined") {
                  const urlToReturn = new URL(
                    serverUrl ?? ""
                  ) as unknown as Location;
                  return urlToReturn;
                }
                return window.location;
              },
              cleanUrlOnDispose: false,
            }),
          }}
        >
          <Configure hitsPerPage={100} />
          {/* <SortBy
            items={[{ label: "Year", value: "instant_search_year_asc" }]}
          /> */}
          <div className="flex mt-6">
            <div className="my-4 ms-12 min-w-48">
              {/* <SearchBox
                classNames={{
                  // submitIcon: "relative -top-5 left-1",
                  submitIcon: "hidden",
                  input: "px-4 py-1 bg-white outline outline-1 rounded-md",
                }}
                placeholder="Search Maps..."
              /> */}
              {/* <FacetMenu /> */}
              <h2 className="text-lg">Filter by Place</h2>
              <RefinementList
                attribute="places"
                operator="or"
                classNames={{
                  root: "text-sm",
                  label: "flex flex-row gap-2 my-2",
                  // count: "text-right flex-grow",
                }}
              />
            </div>
            <Hits
              hitComponent={PanoPreview}
              classNames={{
                list: "grid grid-cols-1 xl:grid-cols-3 pe-6 xl:pe-12",
              }}
            />
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </section>
  );
};

const PanoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <div>
      <PanoCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default PanoCollectionIndex;
