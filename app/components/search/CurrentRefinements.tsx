import { useCurrentRefinements } from "react-instantsearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { PLACE_TYPES } from "~/config";

const CurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements();

  if (items.length > 0) {
    return (
      <div className="flex px-4 items-center">
        <div className="me-0 xl:me-2 text-sm text-gray-700">Filters:</div>
        <ul className="list-none flex flex-wrap space-3 ps-4 mb-4">
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
      </div>
    );
  }

  return <></>;
};

export default CurrentRefinements;
