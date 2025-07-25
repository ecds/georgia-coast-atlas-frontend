import { useState } from "react";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { useLoaderData } from "react-router";
import { photosIndexCollection, searchRouter } from "~/config";
import { photoCollection } from "~/utils/elasticsearchAdapter";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import ViewToggle from "~/components/collections/ViewToggle";
import CollectionMap from "~/components/collections/CollectionMap";
import CollectionContainer from "~/components/collections/CollectionContainer";
import type { LoaderFunction } from "react-router";
import type { ESSearchProps } from "~/esTypes";

const INITIAL_COUNT = 24;

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <PhotographCollection serverUrl={serverUrl} />,
    { renderToString }
  );

  return { serverState, serverUrl };
};

export const meta = () =>
  collectionMetadata({
    title: "Photograph Collection",
    description:
      "TODO: Add descriptive text about the photograph collection here.",
    image: "TODO: Add a valid og:image URL for the photograph collection here.",
    slug: "photographs",
  });

const PhotographCollection = ({
  serverState,
  serverUrl,
  children,
}: ESSearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={photosIndexCollection}
        searchClient={photoCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={INITIAL_COUNT} />
        <CollectionList>
          <PlaceFacets />
          {children}
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const PhotographCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;
  const [viewMode, setViewMode] = useState<"grid" | "map" | undefined>();

  return (
    <PhotographCollection serverState={serverState} serverUrl={serverUrl}>
      <CollectionContainer collectionType="photographs">
        <ViewToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
          initialCount={INITIAL_COUNT}
        />
        <Thumbnails
          collectionType="photographs"
          className={viewMode === "grid" ? "block" : "hidden"}
        />
        <CollectionMap
          collectionType="photographs"
          className={viewMode === "map" ? "block" : "hidden"}
        />
      </CollectionContainer>
    </PhotographCollection>
  );
};

export default PhotographCollectionIndex;
