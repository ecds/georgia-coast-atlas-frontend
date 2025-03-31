import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { photosIndexCollection, searchRouter } from "~/config";
import { photoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import type { LoaderFunction } from "@remix-run/node";
import type { ESSearchProps,  ESRelatedPlace } from "~/esTypes";
import { useState } from "react";
import { PlaceContext } from "~/contexts";


export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <PhotographCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  return {
    serverState,
    serverUrl,
  };
};

const PhotographCollection = ({ serverState, serverUrl }: ESSearchProps) => {

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
          indexName={photosIndexCollection}
          searchClient={photoCollection}
          future={{ preserveSharedStateOnUnmount: true }}
          routing={searchRouter(serverUrl)}
        >
          <Configure hitsPerPage={24} />
          <CollectionList>
            <PlaceFacets />
            <Thumbnails collectionType="photographs" />
          </CollectionList>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </PlaceContext.Provider>
  );
};

const PhotographCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;

  return (
    <div>
      <PhotographCollection serverState={serverState} serverUrl={serverUrl} />
    </div>
  );
};

export default PhotographCollectionIndex;
