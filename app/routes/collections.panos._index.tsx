import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { panosIndexCollection, searchRouter } from "~/config";
import { panoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import type { InstantSearchServerState } from "react-instantsearch";
import type { LoaderFunction } from "@remix-run/node";
import Thumbnails from "~/components/collections/Thumbnails";
import { useState } from "react";
import { PlaceContext } from "~/contexts";
import type { ESRelatedPlace, ESSearchProps } from "~/esTypes";

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

const PanoCollection = ({ serverState, serverUrl }: ESSearchProps) => {
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
          indexName={panosIndexCollection}
          searchClient={panoCollection}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={searchRouter(serverUrl)}
        >
          <Configure hitsPerPage={100} />
          <CollectionList>
            <PlaceFacets />
            <Thumbnails collectionType="panos" />
          </CollectionList>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </PlaceContext.Provider>
  );
};

const PanoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;

  return (
    <div>
      <PanoCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default PanoCollectionIndex;
