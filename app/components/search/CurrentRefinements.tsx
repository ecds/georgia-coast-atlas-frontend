import { useCurrentRefinements, useSortBy } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { indexCollection, PLACE_TYPES } from "~/config";
import GeoToggle from "./GeoToggle.client";
import { ClientOnly } from "remix-utils/client-only";

const CurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();
  const {
    currentRefinement,
    refine: sortBy,
    options,
  } = useSortBy({
    items: [
      { label: "Name", value: indexCollection },
      { label: "Relevance", value: `${indexCollection}_score` },
    ],
  });
  // Docs for useGeoSearch function: https://www.algolia.com/doc/api-reference/widgets/geo-search/js/#create-a-render-function
  // const { isRefinedWithMap } = useGeoSearch();

  return (
    <>
      <div className="col-span-4 px-4 flex flex-col xl:flex-row">
        <label
          className="block text-sm ps-3 p-0 xl:p-2 font-medium text-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          htmlFor="sort-select"
        >
          Sort:
        </label>
        <select
          onChange={(event) => sortBy(event.target.value)}
          value={currentRefinement}
          id="sort-select"
          className="h-8 px-2 w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ClientOnly>{() => <GeoToggle />}</ClientOnly>
      <ul className="col-span-5 list-none flex flex-wrap space-3 ps-4 mb-4">
        {items.map((item) => {
          return item.refinements.map((refinement) => {
            return (
              <li
                key={refinement.value}
                className={`p-1 text-xs font-medium me-2 mt-2 px-2 py-0.5 rounded-lg h-min w-max bg-${PLACE_TYPES[refinement.label]?.bgColor ?? "green-100"} text-${PLACE_TYPES[refinement.label]?.textColor ?? "green-800"} border-2 border-${PLACE_TYPES[refinement.label]?.textColor ?? "green-800"}`}
              >
                {refinement.label}{" "}
                <button onClick={() => refine(refinement)}>
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </li>
            );
          });
        })}
      </ul>
    </>
  );
};

export default CurrentRefinements;
