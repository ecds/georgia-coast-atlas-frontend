import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  getServerState,
  useHits,
} from "react-instantsearch";
import { renderToString } from "react-dom/server";
import { toursIndexCollection, searchRouter } from "~/config";
import { toursCollection } from "~/utils/elasticsearchAdapter";
import { useLoaderData } from "react-router";
import { collectionMetadata } from "~/utils/collectionMetaTags";
// import PlaceFacets from "~/components/collections/PlaceFacets";
import CollectionList from "~/components/collections/CollectionList";
// import CollectionContainer from "~/components/collections/CollectionContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import type { LoaderFunction } from "react-router";
import type { ESSearchProps } from "~/esTypes";

export const meta = () =>
  collectionMetadata({
    title: "Tours Collection",
    description: "TODO: Add descriptive text about the tours collection here.",
    image: "TODO: Add a valid og:image URL for the tours collection here.",
    slug: "tours",
  });

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl: string = request.url;
  const serverState = await getServerState(
    <TourCollection serverUrl={serverUrl} />,
    { renderToString },
  );

  return { serverState, serverUrl };
};

const TourCollection = ({
  serverState,
  serverUrl,
  children,
}: ESSearchProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={toursIndexCollection}
        searchClient={toursCollection}
        future={{ preserveSharedStateOnUnmount: true }}
        routing={searchRouter(serverUrl)}
      >
        <Configure hitsPerPage={100} />
        <CollectionList>
          {/* <PlaceFacets /> */}
          {children}
        </CollectionList>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
};

const TourList = () => {
  const { items } = useHits();
  return (
    <div className="my-4 h-full overflow-auto">
      <ul className="mx-4 md:mx-12 lg:mx-32 flex grow flex-col md:flex-row flex-wrap items-center justify-center md:items-start">
        <li className="basis-full grow self-stretch w-full">
          <h1 className="text-3xl text-black/80 m-4 ps-4 md:m-auto md:ms-2 capitalize">
            Tours
          </h1>
        </li>
        {items.map((item) => (
          <li key={item.objectID} className="w-56 md:w-44 lg:w-56 xl:w-64 mx-2">
            <a href={item.link} target="_blank" rel="noreferrer" className="">
              <div
                className={`flex px-2 md:px-0 aspect-video w-56 md:w-44 lg:w-56 xl:w-64 md:mb-auto mt-6 md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start bg-cover bg-no-repeat bg-center rounded-md drop-shadow-md`}
                style={{
                  backgroundImage: `url(${item.thumbnail_url})`,
                }}
              ></div>
              <h2 className="text-sm mb-2 xl:my-2 truncate md:text-wrap text-blue-700 hover:text-blue-800 underline">
                {item.title ?? item.name}{" "}
                <FontAwesomeIcon icon={faExternalLink} />
              </h2>
            </a>
            <ul className="hidden md:block text-xs w-56 md:w-44 lg:w-56 xl:w-64">
              {item.places?.length > 0 && (
                <li>
                  <span className="font-semibold">Places:</span>{" "}
                  {item.place_names.join(",")}
                </li>
              )}
              {item.date && (
                <li>
                  <span className="font-semibold">Date:</span> {item.date}
                </li>
              )}
              {item.publisher && (
                <li>
                  <span className="font-semibold">Publisher:</span>{" "}
                  {item.publisher}
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
      {/* {items.length > 24 && ( */}
      <Pagination
        classNames={{
          root: "justify-self-center px-2 py-4 bg-white w-full md:w-2/3 lg:w-2/5 my-4",
          list: "flex flex-row items-stretch justify-center",
          pageItem:
            "bg-county text-white mx-4 text-center rounded-md min-w-6 max-w-8",
          selectedItem: "bg-activeCounty/50 text-white",
        }}
        padding={2}
      />
      {/* )} */}
    </div>
  );
};

const TourCollectionIndex = () => {
  const { serverState, serverUrl } = useLoaderData() as ESSearchProps;

  return (
    <TourCollection serverState={serverState} serverUrl={serverUrl}>
      {/* <CollectionContainer collectionType="tours"> */}
      <TourList />
      {/* </CollectionContainer> */}
    </TourCollection>
  );
};

export default TourCollectionIndex;
