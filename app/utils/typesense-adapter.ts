// FIXME: This is a known issue: https://github.com/typesense/typesense-instantsearch-adapter/issues/199
import TypesenseInstantSearchAdapterExport from "typesense-instantsearch-adapter";
import { keys, modelFieldUUIDs } from "~/config";

export const TypesenseInstantSearchAdapter =
  // @ts-ignore
  TypesenseInstantSearchAdapterExport.default ??
  TypesenseInstantSearchAdapterExport;

export const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: keys.typesense,
    connectionTimeoutSeconds: 10000,
    nodes: [
      {
        host: "coredata.ecdsdev.org",
        port: 443,
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  geoLocationField: "coordinates",
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "*",
    collection: "gca",
    facet_by: `${modelFieldUUIDs.county}.names_facet,${modelFieldUUIDs.types}.name_facet`,
    per_page: 25,
  },
});

export const searchClient = typesenseInstantSearchAdapter.searchClient;
