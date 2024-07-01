import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { TypesenseInstantSearchAdapter } from "~/utils/typesense-adapter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSearch,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import type { Hit as THit } from "instantsearch.js";
import type { ReactNode } from "react";

const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "a97debbe278d", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "coredata.ecdsdev.org",
        port: 443,
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "name,names",
    collection: "gca",
    facet_by: "*",
    max_facet_values: 20,
  },
});
const searchClient = typesenseInstantSearchAdapter.searchClient;

const Hit = ({ hit }: { hit: THit }) => {
  return <span>{hit.name}</span>;
};

const ButtonComponent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={`absolute top-2.5 text-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ${className ?? ""}`}
    >
      {children}
    </span>
  );
};
const SubmitComponent = () => {
  return (
    <ButtonComponent className="end-2.5">
      <FontAwesomeIcon icon={faSearch} />
    </ButtonComponent>
  );
};

const ResetComponent = () => {
  return (
    <ButtonComponent className="end-8">
      <FontAwesomeIcon icon={faClose} />
    </ButtonComponent>
  );
};

const LoadingComponent = () => {
  return (
    <ButtonComponent className="end-8">
      <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
    </ButtonComponent>
  );
};

const Search = () => {
  return (
    <InstantSearch indexName="gca" searchClient={searchClient}>
      <SearchBox
        resetIconComponent={ResetComponent}
        submitIconComponent={SubmitComponent}
        loadingIconComponent={LoadingComponent}
        placeholder="Search Places"
        classNames={{
          root: "px-8",
          form: "max-w-md relative h-16",
          input:
            "block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 appearance-none",
          resetIcon: "hidden",
        }}
      />
      <Hits hitComponent={Hit} classNames={{ root: "px-8" }} />
    </InstantSearch>
  );
};

export default Search;
