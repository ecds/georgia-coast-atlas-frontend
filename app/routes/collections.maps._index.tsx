import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { mapIndexCollection, searchRouter } from "~/config";
import { mapCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import { PlaceContext } from "~/contexts";
import type { ESRelatedPlace } from "~/esTypes";

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  location?: Location;
  modalOpen?: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <MapCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const MapCollection = ({ serverState, serverUrl }: SearchProps) => {
  const [activePlace, setActivePlace] = useState<ESRelatedPlace | undefined>();
  const [hoveredPlace, setHoveredPlace] = useState<ESRelatedPlace | undefined>();
  
  return (
    <PlaceContext.Provider
      value={{
        place: { uuid: "", places: [], other_places: [] } as any,
        activePlace,
        setActivePlace,
        hoveredPlace,
        setHoveredPlace,
      }}
    >
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          indexName={mapIndexCollection}
          searchClient={mapCollection}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={searchRouter(serverUrl)}
        >
          <Configure hitsPerPage={24} />
          <CollectionList>
            <PlaceFacets />
            <Thumbnails collectionType="maps" />
          </CollectionList>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </PlaceContext.Provider>
  );
};


const MapCollectionPage = () => {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <div>
      <MapCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default MapCollectionPage;
