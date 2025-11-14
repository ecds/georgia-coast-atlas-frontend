import { PLACE_TYPES } from "~/config";
import { useContext } from "react";
import { PlaceContext } from "~/contexts";
import type { Hit } from "instantsearch.js";

const SearchResult = ({ hit }: { hit: Hit }) => {
  const { setClickedPlace, setHoveredPlace } = useContext(PlaceContext);

  return (
    <div
      className="flex flex-col border-b-2 pb-2 px-4 hover:bg-gray-200 focus:bg-red-400"
      onMouseEnter={() => setHoveredPlace(hit)}
      onMouseLeave={() => setHoveredPlace(undefined)}
    >
      <div className="grow top-0">
        <button
          role="link"
          onClick={() => setClickedPlace(hit.slug)}
          className="grow min-w-[75%] cursor-pointer py-0.5 text-start"
        >
          <h4 className="">{hit.name}</h4>
        </button>
      </div>
      <div className="flex flex-row text-xs items-stretch">
        <div className="grow self-end">{hit.county ?? "Georgia"}</div>
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
