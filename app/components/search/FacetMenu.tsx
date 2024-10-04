import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItems, MenuSection } from "@headlessui/react";
import {
  ClearRefinements,
  RefinementList,
  useRefinementList,
} from "react-instantsearch";
import { modelFieldUUIDs, PLACE_TYPES } from "~/config";
import type { RefinementListClassNames } from "node_modules/react-instantsearch/dist/es/ui/RefinementList";

const refinementListClassNames = (type: string) => {
  console.log("🚀 ~ refinementListClassNames ~ type:", type);
  const classNames: Partial<RefinementListClassNames> = {
    checkbox:
      "me-2 group size-3 rounded border bg-white data-[checked]:bg-blue-500",
    count:
      "bg-blue-100 text-blue-800 text-xs font-medium mx-2 px-2.5 py-0.5 rounded",
    item: `py-2 font-light text-sm bg-${PLACE_TYPES[type]?.bgColor ?? "green-100"} text-${PLACE_TYPES[type]?.textColor ?? "green-800"}`,
    selectedItem: "font-semibold",
  };
  return classNames;
};

const FacetMenu = () => {
  const { items, toggleShowMore, isShowingMore } = useRefinementList({
    attribute: `${modelFieldUUIDs.types}.name_facet`,
    showMore: true,
    showMoreLimit: Object.keys(PLACE_TYPES).length + 1,
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
          {/* <RefinementList
            attribute={`${modelFieldUUIDs.types}.name_facet`}
            classNames={refinementListClassNames(
              `${modelFieldUUIDs.types}.name_facet`
            )}
            sortBy={["count:desc"]}
            showMore
            showMoreLimit={200}
            operator="and"
          /> */}
          <ul>
            {items.map((type) => {
              return (
                <li
                  key={type.value}
                  className={`p-1 my-2 rounded-md bg-${PLACE_TYPES[type.value]?.bgColor ?? "green-100"} text-${PLACE_TYPES[type.value]?.textColor ?? "green-800"} flex`}
                >
                  <input type="checkbox" className="ml-2 mr-4" />
                  <span className="block">{type.label}</span>
                  <span className="block ml-4">{type.count}</span>
                </li>
              );
            })}
          </ul>
          <button onClick={toggleShowMore}>
            {isShowingMore ? "show less" : "shwo more"}
          </button>
        </MenuSection>
        <MenuSection>
          <RefinementList
            attribute={`${modelFieldUUIDs.county}.names_facet`}
            classNames={refinementListClassNames("Pond")}
            sortBy={["name:asc"]}
            operator="and"
          />
        </MenuSection>
      </MenuItems>
    </Menu>
  );
};

export default FacetMenu;
