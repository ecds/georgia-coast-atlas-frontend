import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import { useHits } from "react-instantsearch";

interface Props {
  collectionType: string;
  children?: ReactNode;
}

const Thumbnails = ({ collectionType, children }: Props) => {
  const { items } = useHits();

  return (
    <div className="-mt-16 md:mt-auto">
      <h1 className="text-3xl text-black/80 m-4 md:m-auto md:ms-2 capitalize">
        {collectionType}
      </h1>
      <div>
        <ol className="flex flex-col md:flex-none md:grid md:grid-cols-1 lg:grid-cols-3 md:pe-6">
          {items.map((item) => {
            return (
              <li key={item.objectID}>
                <figure className="flex flex-col md:flex-row lg:flex-col items-center md:items-start md:space-x-4 lg:space-x-0 px-2 md:px-0 lg:px-2 mb-6 md:mb-auto md:ms-2 md:mt-12 lg:mt-6 w-full">
                  <Link
                    to={`/collections/${collectionType.toLocaleLowerCase()}/${item.slug}`}
                  >
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="shadow-md w-full"
                    />
                  </Link>
                  <figcaption className="text-sm text-black/75 md:col-span-2 md:px-2 lg:px-0 lg:pe-4 w-full">
                    <h2 className="text-lg md:text-base text-black mb-2 xl:my-2 truncate md:text-wrap">
                      {item.name}
                    </h2>
                    <div
                      className="tracking-loose my-2"
                      dangerouslySetInnerHTML={{
                        __html: item.description ?? "",
                      }}
                    />

                    <ul className="">
                      <li className="">
                        <span className="font-semibold">Places:</span>{" "}
                        {item.places.join(",")}
                      </li>
                    </ul>
                    {children}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default Thumbnails;
