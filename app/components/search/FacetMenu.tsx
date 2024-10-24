import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItems, MenuSection } from "@headlessui/react";
import {
  ClearRefinements,
  RefinementList,
  useRefinementList,
} from "react-instantsearch";
import { PLACE_TYPES } from "~/config";
import type { RefinementListClassNames } from "node_modules/react-instantsearch/dist/es/ui/RefinementList";

const refinementListClassNames = () => {
  const classNames: Partial<RefinementListClassNames> = {
    checkbox:
      "me-2 group size-3 rounded border bg-white data-[checked]:bg-blue-500",
    count:
      "bg-blue-100 text-blue-800 text-xs font-medium mx-2 px-2.5 py-0.5 rounded",
    item: `py-2 font-light text-sm`,
    selectedItem: "font-semibold",
  };
  return classNames;
};

const FacetMenu = () => {
  const { items, toggleShowMore, isShowingMore, refine } = useRefinementList({
    attribute: "types",
    showMore: true,
    showMoreLimit: Object.keys(PLACE_TYPES).length + 1,
    operator: "or",
  });
  return (
    <Menu>
      <MenuButton className="w-full h-14 bg-blue-100 text-blue-800 font-medium mx-2 px-2.5 py-0.5 rounded">
        <FontAwesomeIcon icon={faFilter} />
      </MenuButton>
      <MenuItems
        unmount={false}
        anchor="bottom start"
        transition
        className="w-auto bg-white p-4 rounded drop-shadow origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 min-w-72"
      >
        <MenuSection className="mb-2 pb-4 border-b-2">
          <ClearRefinements
            classNames={{
              button:
                "px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
              disabledButton: "opacity-50 hover:opacity-40 cursor-not-allowed",
            }}
            translations={{
              resetButtonText: "Clear all",
            }}
          />
        </MenuSection>
        <MenuSection className="mb-4 pb-4 border-b-2">
          <ul>
            {items.map((type, index) => {
              return (
                <li key={type.label} className="flex items-center me-4 my-2">
                  <input
                    type="checkbox"
                    className={`w-6 h-6 text-${PLACE_TYPES[type.value]?.bgColor ?? "green-800"} bg-gray-100 border-gray-300 rounded focus:ring-${PLACE_TYPES[type.value]?.bgColor ?? "green-800"} focus:ring-2`}
                    checked={type.isRefined}
                    onChange={() => refine(type.value)}
                    id={`type-${index}`}
                  />
                  <label htmlFor={`type-${index}`}>
                    <span className="ms-2 text-sm font-light">
                      {type.label}
                    </span>
                    <span
                      className={`ms-2 p-1 text-xs font-medium text-${PLACE_TYPES[type.value]?.textColor ?? "green-800"} rounded bg-${PLACE_TYPES[type.value]?.bgColor ?? "green-100"}`}
                    >
                      {type.count}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            onClick={toggleShowMore}
            className={`border-2 rounded-md p-1 capitalize mt-2 bg-gray-200`}
          >
            {isShowingMore ? "show less" : "show more"}
          </button>
        </MenuSection>
        <MenuSection>
          <RefinementList
            attribute="county"
            classNames={refinementListClassNames()}
            sortBy={["name:asc"]}
            operator="or"
          />
        </MenuSection>
      </MenuItems>
    </Menu>
  );
};

export default FacetMenu;
