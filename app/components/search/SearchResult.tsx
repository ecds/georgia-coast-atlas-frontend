import { PLACE_TYPES } from "~/config";
import { Link } from "@remix-run/react";
import type { Hit } from "instantsearch.js";

const SearchResult = ({ hit }: { hit: Hit }) => {
  return (
    <div className="flex border-b-2 py-2 pl-4 w-full">
      <Link
        state={{ backTo: "Search Results" }}
        className="grow min-w-[75%] cursor-pointer"
        to={`/places/${hit.slug}`}
      >
        <h4 className="text-lg">{hit.name}</h4>
      </Link>
      <div className="col-span-2 flex flex-wrap flex-row-reverse">
        {hit.types?.map((type: string, index: number) => {
          return (
            <span
              key={`${type}${hit.name}`}
              className={`bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} text-${PLACE_TYPES[type]?.textColor ?? "green-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded h-min w-max`}
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
