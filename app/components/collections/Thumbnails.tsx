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
        className={`md:pe-6 md:grid md:grid-cols-1 lg:grid-cols-3 flex flex-col`}
      >
        {items.map((item) => (
          <li key={item.objectID}>
            <figure
              className={`w-full flex px-2 md:px-0 lg:px-2 min-h-[250px] mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0`}
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
                      <span className="font-semibold">Date:</span> {item.date}
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
    </div>
  );
};

export default Thumbnails;
