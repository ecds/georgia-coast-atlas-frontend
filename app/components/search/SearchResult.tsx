import { modelFieldUUIDs } from "~/config";
import type { Hit } from "instantsearch.js";
import type { TTypeHit } from "~/types";

const SearchResult = ({ hit }: { hit: Hit }) => {
  return (
    <div className="flex border-b-2 py-2 w-full">
      <h4 className="text-lg grow min-w-[75%]">{hit.name}</h4>
      <div className="col-span-2 flex flex-wrap flex-row-reverse">
        {hit[modelFieldUUIDs.types]?.map((t: TTypeHit) => {
          return (
            <span
              key={t.record_id}
              className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded h-min"
            >
              {t.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
