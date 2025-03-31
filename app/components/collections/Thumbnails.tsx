import { faMap, faTableCells, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useSearchParams, useNavigate } from "@remix-run/react";
import { Pagination, useHits } from "react-instantsearch";
import { useState, useEffect } from "react";
import { ClientOnly } from "remix-utils/client-only";
import type { ReactNode } from "react";
import Map from "~/components/mapping/Map.client";
import { hitsToFeatureCollection } from "~/utils/toFeatureCollection";
import type { FeatureCollection } from "geojson";
import CollectionMapOverlay from "./CollectionMapOverlay";
import { PlaceContext } from "~/contexts";
import type { ESRelatedPlace } from "~/esTypes";


interface Props {
  collectionType: string;
  children?: ReactNode;
}

const Thumbnails = ({ collectionType, children }: Props) => {
  const { items } = useHits();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");

  const geojson = hitsToFeatureCollection(items);
  console.log("Items passed to map", items);

  const toggleListGrid = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <div className="-mt-16 md:mt-0 h-full overflow-auto">
      <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2 capitalize">
        {collectionType}
      </h1>

      <div className="flex gap-4 md:ms-2 md:my-2">
      <button
          onClick={toggleListGrid}
          className="border border-island px-2 py-1 rounded-md shadow-md hover:shadow-lg text-island"
        >
          <FontAwesomeIcon
            icon={viewMode === "list" ? faTableCells : faList}
          />{" "}
          {viewMode === "list" ? "Grid View" : "List View"}
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`border px-2 py-1 rounded-md shadow-md hover:shadow-lg ${
            viewMode === "map"
              ? "bg-island text-white"
              : "border-island text-island"
          }`}
        >
          <FontAwesomeIcon icon={faMap} /> Map View
        </button>
      </div>

      {viewMode === "grid" || viewMode === "list" ? (
        <>
          <ol
            className={`md:pe-6 ${
              viewMode === "grid"
                ? "md:grid md:grid-cols-1 lg:grid-cols-3"
                : "flex flex-col"
            }`}
          >
            {items.map((item) => (
              <li key={item.objectID}>
                <figure
                  className={`w-full flex px-2 md:px-0 lg:px-2 ${
                    viewMode === "grid"
                      ? "min-h-[250px] mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0"
                      : "border-b border-black/10 shadow-sm pb-4 mb-2 last:mb-0 min-h-[140px] flex-row items-start gap-4"
                  }`}
                >
                  <Link
                    to={`/collections/${collectionType.toLowerCase()}/${item.slug}`}
                  >
                    <img
                      src={item.thumbnail_url}
                      alt={item.alt ?? ""}
                      className="shadow-md"
                    />
                  </Link>
                  <figcaption className="text-sm text-black/75 md:col-span-2 md:px-2 lg:px-0 lg:pe-4 w-full">
                    <h2 className="text-lg md:text-base text-black mb-2 xl:my-2 truncate md:text-wrap">
                      {item.title ?? item.name}
                    </h2>
                    <div
                      className="tracking-loose my-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description ?? "",
                      }}
                    />
                    <ul>
                      {item.places?.length > 0 && (
                        <li>
                          <span className="font-semibold">Places:</span>{" "}
                          {item.place_names.join(",")}
                        </li>
                      )}
                      {item.date && (
                        <li>
                          <span className="font-semibold">Date:</span>{" "}
                          {item.date}
                        </li>
                      )}
                    </ul>
                    {children}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
          <Pagination
            classNames={{
              root: "justify-self-center px-2 py-4 bg-white w-full md:w-2/3 lg:w-2/5",
              list: "flex flex-row items-stretch justify-center",
              pageItem:
                "bg-county/20 text-white mx-4 text-center rounded-md min-w-6 max-w-8",
              selectedItem: "bg-county text-white",
            }}
            padding={2}
          />
        </>
      ) : (
        <div className="h-[700px] mt-6 mx-2 rounded-md overflow-hidden">
          <ClientOnly>
            {() => (
              <Map className="w-full h-full">
                <CollectionMapOverlay geojson={geojson} />
              </Map>
            )}
          </ClientOnly> 
        </div>
      )}
    </div>
  );
};

export default Thumbnails;