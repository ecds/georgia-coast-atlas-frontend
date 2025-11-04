import { PLACE_TYPES } from "~/config";
import { Link, useLocation } from "react-router";
import { useContext } from "react";
import { SearchContext } from "~/contexts";
import type { Hit } from "instantsearch.js";

const SearchResult = ({ hit }: { hit: Hit }) => {
  const { setActiveResult } = useContext(SearchContext);
  const location = useLocation();

  return (
    <div
      className="flex flex-col border-b-2 pb-2 px-4 focus:bg-red-400"
      onMouseEnter={() => setActiveResult(hit.identifier)}
      onMouseLeave={() => setActiveResult(undefined)}
    >
      <Link
        state={{
          title: "Search Results",
          slug: "search",
          previous: `${location.pathname}${location.search}`,
        }}
        className="grow min-w-[75%] cursor-pointer py-0.5"
        to={`/places/${hit.slug}`}
      >
        <h4 className="">{hit.name}</h4>
      </Link>
      <div className="flex flex-row text-xs">
        <div className="grow">{hit.county}</div>
        {hit.types?.map((type: string) => {
          return (
            <div
              key={`${type}${hit.name}`}
              className={`bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} ${hit.types.length > 1 ? "m-1" : ""} text-${PLACE_TYPES[type]?.textColor ?? "green-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded h-min w-max`}
            >
              {type}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
