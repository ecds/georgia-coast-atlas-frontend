import Searchkit from "searchkit";
import Client from "@searchkit/instantsearch-client";
import { dataHosts, keys } from "~/config";

const sk = new Searchkit({
  connection: {
    host: dataHosts.elasticSearch,
    headers: {
      authorization: `ApiKey ${keys.elasticsearch}`,
    },
  },
  search_settings: {
    search_attributes: [
      {
        field: "name",
        weight: 3,
      },
      "description",
    ],
    // sorting: { name: { field: "slug", order: "desc" } },
    result_attributes: [
      "name",
      "description",
      "county",
      "uuid",
      "location",
      "types",
      "identifier",
      "slug",
    ],
    facet_attributes: [
      { attribute: "types", field: "types", type: "string" },
      { attribute: "county", field: "county", type: "string" },
    ],
    geo_attribute: "location",
  },
});

export const searchClient = Client(sk, {
  hooks: {
    beforeSearch: async (searchRequests) => {
      return searchRequests.map((sr) => {
        return {
          ...sr,
          body: {
            ...sr.body,
            size: 500,
            sort: [{ slug: "asc" }],
          },
        };
      });
    },
  },
});
