import { Link } from "@remix-run/react";
import { useInfiniteHits } from "react-instantsearch";
import { PLACE_TYPES } from "~/config";

const SearchResults = () => {
  const { items, showMore, isLastPage } = useInfiniteHits();
  return (
    <div>
      <ul className="px-8 overflow-auto">
        {items.map((item) => {
          return (
            <li key={item.uuid}>
              <div className="flex border-b-2 py-2 w-full">
                <Link
                  state={{ backTo: "Search Results" }}
                  className="grow min-w-[75%] cursor-pointer"
                  to={`/places/${item.slug}`}
                >
                  <h4 className="text-lg">{item.name}</h4>
                </Link>
                <div className="col-span-2 flex flex-wrap flex-row-reverse">
                  {item.types?.map((type: string, index: number) => {
                    return (
                      <span
                        key={`${type}${item.name}`}
                        className={`bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} text-${PLACE_TYPES[type]?.textColor ?? "green-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded h-min w-max`}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <button onClick={showMore} disabled={isLastPage}>
        Show More
      </button>
    </div>
  );
};

export default SearchResults;
