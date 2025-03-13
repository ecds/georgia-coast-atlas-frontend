import Searchkit from "searchkit";
import Client from "@searchkit/instantsearch-client";
import { dataHosts, keys } from "~/config";
import { AllPlacesSearch } from "./searchClients/AllPlaces";
import { MapsSearch } from "./searchClients/MapCollection";
import { PanosSearch } from "./searchClients/PanoCollection";
import { VideoSearch } from "./searchClients/VideoCollection";
import { PhotoSearch } from "./searchClients/PhotoCollection";

const connection = {
  host: dataHosts.elasticSearch,
  headers: {
    authorization: `ApiKey ${keys.elasticsearch}`,
  },
};

export const allPlacesSearchClient = Client(
  new Searchkit({
    connection,
    search_settings: AllPlacesSearch,
  })
);

export const mapCollection = Client(
  new Searchkit({ connection, search_settings: MapsSearch })
);

export const panoCollection = Client(
  new Searchkit({ connection, search_settings: PanosSearch })
);

export const videoCollection = Client(
  new Searchkit({ connection, search_settings: VideoSearch })
);

export const photoCollection = Client(
  new Searchkit({ connection, search_settings: PhotoSearch })
);
