import { Link } from "react-router";
import { Pagination, useHits } from "react-instantsearch";
import type { CollectionType } from "~/esTypes";

interface Props {
  collectionType: CollectionType;
  className?: string;
  aspect?: "square" | "video";
}

const Thumbnails = ({ collectionType, className, aspect }: Props) => {
  const { items } = useHits();

  return (
    <div className={className}>
      <ol
        // className={`md:pe-6 md:grid md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 flex flex-col`}
        className="flex flex-col md:flex-row flex-wrap items-center justify-center md:items-start mx-4 md:mx-auto"
      >
        {items.map((item) => (
          <li key={item.objectID} className="w-56 md:w-44 lg:w-56 xl:w-64 mx-2">
            <Link
              to={`/collections/${collectionType.toLowerCase()}/${item.slug}`}
              state={{ backTo: `Back to ${collectionType} Collection` }}
            >
              <div
                className={`flex px-2 md:px-0 aspect-${aspect ?? "square"} w-56 md:w-44 lg:w-56 xl:w-64 md:mb-auto mt-6 md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start bg-cover bg-no-repeat bg-center rounded-md drop-shadow-md`}
                style={{ backgroundImage: `url(${item.thumbnail_url})` }}
              >
                <div
                  className="sr-only tracking-loose my-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: item.description ?? "",
                  }}
                />
              </div>
            </Link>
            <h2 className="text-sm text-black mb-2 xl:my-2 truncate md:text-wrap">
              {item.title ?? item.name}
            </h2>
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
    </div>
  );
};

export default Thumbnails;
