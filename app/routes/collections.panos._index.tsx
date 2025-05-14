import { useState } from "react";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import type { LoaderFunction } from "@remix-run/node";
import { panosIndexCollection, searchRouter } from "~/config";
import { panoCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "@remix-run/react";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import CollectionContainer from "~/components/collections/CollectionContainer";
import ViewToggle from "~/components/collections/ViewToggle";
import CollectionMapOverlay from "~/components/collections/CollectionMapOverlay";
import type { ESSearchProps } from "~/esTypes";

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

const PanoCollection = ({
  serverState,
  serverUrl,
  children,
}: ESSearchProps) => {
  return (
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
          {children}
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PanoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;
  const [viewMode, setViewMode] = useState<"grid" | "map" | undefined>();

  return (
    <div>
      <PanoCollection serverState={serverState} serverUrl={serverUrl}>
        <CollectionContainer collectionType="panos">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <Thumbnails
            collectionType="panos"
            className={viewMode === "grid" ? "block" : "hidden"}
            aspect="video"
          />
          <CollectionMapOverlay
            collectionType="panos"
            className={viewMode === "map" ? "block" : "hidden"}
          />
        </CollectionContainer>
      </PanoCollection>
    </div>
  );
};

export default PanoCollectionIndex;

export const meta = () =>
  collectionMetadata({
    title: "Panos Collection",
    description: "TODO: Add descriptive text about the panos collection here.",
    image: "TODO: Add a valid og:image URL for the panos collection here.",
    slug: "panos",
  });