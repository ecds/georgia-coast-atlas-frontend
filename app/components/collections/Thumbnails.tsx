import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import { Pagination, useHits } from "react-instantsearch";

interface Props {
  collectionType: string;
  children?: ReactNode;
}

const Thumbnails = ({ collectionType, children }: Props) => {
  const { items } = useHits();
  console.log("🚀 ~ Thumbnails ~ items:", items);

  return (
    <div className="-mt-16 md:mt-0 h-full overflow-auto">
      <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2 capitalize">
        {collectionType}
      </h1>
      <div>
        <ol className="flex flex-col md:flex-none md:grid md:grid-cols-1 lg:grid-cols-3 md:pe-6">
          {items.map((item) => {
            return (
              <li key={item.objectID}>
                <figure className="min-w-[250px] min-h-[250px] flex flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 px-2 md:px-0 lg:px-2 mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 w-full">
                  <Link
                    to={`/collections/${collectionType.toLocaleLowerCase()}/${item.slug}`}
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
                        <li className="">
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
            );
          })}
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
    </div>
  );
};

export default Thumbnails;
