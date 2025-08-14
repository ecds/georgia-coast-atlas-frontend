import { useState } from "react";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { useLoaderData } from "react-router";
import { searchRouter, videosIndexCollection } from "~/config";
import { videoCollection } from "~/utils/elasticsearchAdapter";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import CollectionList from "~/components/collections/CollectionList";
import PlaceFacets from "~/components/collections/PlaceFacets";
import Thumbnails from "~/components/collections/Thumbnails";
import CollectionContainer from "~/components/collections/CollectionContainer";
import ViewToggle from "~/components/collections/ViewToggle";
import CollectionMap from "~/components/collections/CollectionMap";
import type { LoaderFunction } from "react-router";
import type { ESSearchProps } from "~/esTypes";

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <VideoCollection serverUrl={serverUrl} />,
    { renderToString }
  );

  return { serverState, serverUrl };
};

export const meta = () =>
  collectionMetadata({
    title: "Videos Collection",
    description: "TODO: Add descriptive text about the videos collection here.",
    image: "TODO: Add a valid og:image URL for the videos collection here.",
    slug: "videos",
  });

const VideoCollection = ({
  serverState,
  serverUrl,
  children,
}: ESSearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={videosIndexCollection}
        searchClient={videoCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} filters="suppress:no" />
        <CollectionList>
          <div className="h-full min-w-fit overflow-y-scroll pb-8">
            <PlaceFacets />
            <PlaceFacets attribute="category" sortBy="name" />
          </div>
          {children}
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const VideoCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;
  const [viewMode, setViewMode] = useState<"grid" | "map" | undefined>();

  return (
    <div>
      <VideoCollection serverState={serverState} serverUrl={serverUrl}>
        <CollectionContainer collectionType="videos">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <Thumbnails
            collectionType="videos"
            className={viewMode === "grid" ? "block" : "hidden"}
            aspect="video"
          />
          {viewMode === "map" && (
            <CollectionMap
              collectionType="videos"
              className={viewMode === "map" ? "block" : "hidden"}
            />
          )}
        </CollectionContainer>
      </VideoCollection>
    </div>
  );
};

export default VideoCollectionIndex;

export const meta = () =>
  collectionMetadata({
    title: "Videos Collection",
    description: "TODO: Add descriptive text about the videos collection here.",
    image: "TODO: Add a valid og:image URL for the videos collection here.",
    slug: "videos",
  });
