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
        field: "names",
        weight: 10,
      },
      "description",
    ],
    result_attributes: [
      "county",
      "description",
      "featured_photograph",
      "identifier",
      "location",
      "name",
      "names",
      "slug",
      "types",
      "uuid",
    ],
    facet_attributes: [
      { attribute: "types", field: "types", type: "string" },
      { attribute: "county", field: "county", type: "string" },
    ],
    geo_attribute: "location",
    sorting: {
      default: {
        field: "slug",
        order: "asc",
      },
      _score: {
        field: "_score",
        order: "desc",
      },
    },
  },
});

export const searchClient = Client(sk);
