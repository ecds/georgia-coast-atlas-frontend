import { Link } from "@remix-run/react";
import { Pagination, useHits } from "react-instantsearch";
import type { ReactNode } from "react";
import type { CollectionType } from "~/esTypes";

interface Props {
  collectionType: CollectionType;
  children?: ReactNode;
  className?: string;
}

const Thumbnails = ({ collectionType, children, className }: Props) => {
  const { items } = useHits();

  return (
    <div className={className}>
      <ol
        // className={`md:pe-6 md:grid md:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 flex flex-col`}
        className="flex flex-col md:flex-row flex-wrap items-center md:items-start mx-4 md:mx-auto"
      >
        {items.map((item) => (
          <li
            key={item.objectID}
            className="w-auto md:w-44 lg:w-56 xl:w-64  md:ms-2"
          >
            <Link
              to={`/collections/${collectionType.toLowerCase()}/${item.slug}`}
            >
              <div
                className={`flex px-2 md:px-0 max-h-56 md:h-44 lg:max-h-56 xl:h-64 w-auto md:w-44 lg:w-56 xl:w-64 md:mb-auto md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 bg-cover bg-no-repeat bg-center`}
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
            <ul className="text-xs w-auto md:w-44 lg:w-56 xl:w-64">
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
            {children}
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
