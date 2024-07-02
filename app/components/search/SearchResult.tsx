import type { Hit } from "instantsearch.js";

const SearchResult = ({ hit }: { hit: Hit }) => {
  console.log("🚀 ~ SearchResult ~ hit:", hit);
  return (
    <div className="flex border-b-2 py-2 w-full">
      <h4 className="text-lg grow max-w-[75%]">{hit.name}</h4>
      <div className="justify-self-end">
        {hit["dc00ae2f-e12f-4bc8-934e-97bad18e5237"]?.map((t: any) => {
          return (
            <span
              key={t.record_id}
              className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10"
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
