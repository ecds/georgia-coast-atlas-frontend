import { modelFieldUUIDs } from "~/config";
import type { Hit } from "instantsearch.js";
import type { TTypeHit } from "~/types";

const SearchResult = ({ hit }: { hit: Hit }) => {
  return (
    <div className="flex border-b-2 py-2 w-full">
      <h4 className="text-lg grow max-w-[75%]">{hit.name}</h4>
      <div className="justify-self-end">
        {hit[modelFieldUUIDs.types]?.map((t: TTypeHit) => {
          return (
            <span
              key={t.record_id}
              className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
            >
              {t.name}
            </span>
          );
        })}
      </div>
      {/* <div
        className="text-sm border-b-2"
        dangerouslySetInnerHTML={{
          __html: hit["159c8717-703e-40c5-a813-425578f9a8a7"],
        }}
      /> */}
    </div>
  );
};

export default SearchResult;
