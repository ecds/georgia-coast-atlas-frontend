import { useCurrentRefinements } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { PLACE_TYPES } from "~/config";

const CurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();
  // Docs for useGeoSearch function: https://www.algolia.com/doc/api-reference/widgets/geo-search/js/#create-a-render-function
  // const { isRefinedWithMap } = useGeoSearch();

  return (
    <ul className="list-none flex flex-wrap space-x-3 ps-4 mb-4">
      {items.map((item) => {
        return item.refinements.map((refinement) => {
          return (
            <li
              key={refinement.value}
              className={`p-1 text-xs font-medium me-2 px-2 py-0.5 rounded h-min w-max bg-${PLACE_TYPES[refinement.label]?.bgColor ?? "green-100"} text-${PLACE_TYPES[refinement.label]?.textColor ?? "green-800"}`}
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
  );
};

export default CurrentRefinements;
