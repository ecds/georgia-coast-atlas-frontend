import { useState } from "react";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  getServerState,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { useLoaderData } from "react-router";
import { mapIndexCollection, searchRouter } from "~/config";
import { mapCollection } from "~/utils/elasticsearchAdapter";
import { collectionMetadata } from "~/utils/collectionMetaTags";
import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
import Thumbnails from "~/components/collections/Thumbnails";
import MenuSelect from "~/components/search/MenuSelect";
import ViewToggle from "~/components/collections/ViewToggle";
import CollectionMapOverlay from "~/components/collections/CollectionMapOverlay";
import type { LoaderFunction } from "react-router";
import type { ESSearchProps } from "~/esTypes";
import CollectionContainer from "~/components/collections/CollectionContainer";
import { indexTotal } from "~/data/coredata";

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <MapCollection serverUrl={serverUrl} />,
    {
      renderToString,
    }
  );

  const total = await indexTotal({ collection: mapIndexCollection });

  return {
    serverState,
    serverUrl,
    total,
  };
};

const MapCollection = ({
  serverState,
  serverUrl,
  children,
  total,
}: ESSearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={mapIndexCollection}
        searchClient={mapCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} />
        <CollectionList>
          <div className="h-full min-w-fit overflow-y-scroll pb-8">
            <MenuSelect
              attribute="categories"
              attributeLabel="Category"
              total={total}
            />
            <PlaceFacets />
            <PlaceFacets attribute="date" sortBy="name" />
            <PlaceFacets attribute="publisher" sortBy="name" />
          </div>
          {children}
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const MapCollectionPage = () => {
  const { serverState, serverUrl, total } = useLoaderData() as ESSearchProps;
  const [viewMode, setViewMode] = useState<"grid" | "map" | undefined>();

  return (
    <div>
      <MapCollection
        serverState={serverState}
        serverUrl={serverUrl}
        total={total}
      >
        <CollectionContainer collectionType="maps">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <Thumbnails
            collectionType="maps"
            className={viewMode === "grid" ? "block" : "hidden"}
          />
          <CollectionMapOverlay
            collectionType="maps"
            className={viewMode === "map" ? "block" : "hidden"}
          />
        </CollectionContainer>
      </MapCollection>
    </div>
  );
};

export default MapCollectionPage;

export const meta = () =>
  collectionMetadata({
    title: "Maps Collection",
    description: "TODO: Add descriptive text about the maps collection here.",
    image: "TODO: Add a valid og:image URL for the maps collection here.",
    slug: "maps",
  });
