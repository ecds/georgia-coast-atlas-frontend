import Searchkit from "searchkit";
import Client from "@searchkit/instantsearch-client";
import { dataHosts, keys } from "~/config";
import { AllPlacesSearch } from "./searchClients/AllPlaces";
import {
  mapAttrs,
  panoAttrs,
  photoAttrs,
  videoAttrs,
} from "./searchClients/CollectionAttrs";
import type { SearchSettingsConfig } from "searchkit";

const connection = {
  host: dataHosts.elasticSearch,
  headers: {
    authorization: `ApiKey ${keys.elasticsearch}`,
  },
};

const searchConfig: SearchSettingsConfig = {
  search_attributes: [
    {
      field: "names",
      weight: 10,
    },
  ],
  result_attributes: [],
  facet_attributes: [
    { attribute: "categories", field: "categories", type: "string" },
    { attribute: "date", field: "date", type: "string" },
    { attribute: "place_names", field: "place_names", type: "string" },
    { attribute: "publisher", field: "publisher", type: "string" },
  ],
  sorting: { default: [{ field: "slug", order: "asc" }] },
};

export const allPlacesSearchClient = Client(
  new Searchkit({
    connection,
    search_settings: AllPlacesSearch,
  })
);

export const mapCollection = Client(
  new Searchkit({
    connection,
    search_settings: { ...searchConfig, ...mapAttrs },
  })
);

export const panoCollection = Client(
  new Searchkit({
    connection,
    search_settings: { ...searchConfig, ...panoAttrs },
  })
);

export const videoCollection = Client(
  new Searchkit({
    connection,
    search_settings: { ...searchConfig, ...videoAttrs },
  })
);

export const photoCollection = Client(
  new Searchkit({
    connection,
    search_settings: { ...searchConfig, ...photoAttrs },
  })
);
