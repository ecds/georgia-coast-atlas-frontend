import { PLACE_TYPES } from "~/config";
import { Link } from "react-router";
import { useContext } from "react";
import { SearchContext } from "~/contexts";
import type { Hit } from "instantsearch.js";

const SearchResult = ({ hit }: { hit: Hit }) => {
  const { setActiveResult } = useContext(SearchContext);
  return (
    <div
      className="flex border-b-2 py-2 w-full px-4 items-center"
      onMouseEnter={() => setActiveResult(hit.identifier)}
      onMouseLeave={() => setActiveResult(undefined)}
    >
      <Link
        state={{ title: "Search Results", slug: "search" }}
        className="grow min-w-[75%] cursor-pointer"
        to={`/places/${hit.slug}`}
      >
        <h4 className="text-lg">{hit.name}</h4>
      </Link>
      <div className="col-span-2 flex flex-wrap flex-row-reverse">
        {hit.types?.map((type: string) => {
          return (
            <span
              key={`${type}${hit.name}`}
              className={`bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} ${hit.types.length > 1 ? "m-1" : ""} text-${PLACE_TYPES[type]?.textColor ?? "green-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded h-min w-max`}
            >
              {type}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
