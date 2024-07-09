import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItems, MenuSection } from "@headlessui/react";
import { ClearRefinements, RefinementList } from "react-instantsearch";
import { modelFieldUUIDs } from "~/config";
import type { RefinementListClassNames } from "node_modules/react-instantsearch/dist/es/ui/RefinementList";

const RefinementListClassNames: Partial<RefinementListClassNames> = {
  checkbox:
    "me-2 group size-3 rounded border bg-white data-[checked]:bg-blue-500",
  count:
    "bg-blue-100 text-blue-800 text-xs font-medium mx-2 px-2.5 py-0.5 rounded",
  item: "py-2 font-light text-sm",
  selectedItem: "font-semibold",
};

const FacetMenu = () => {
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
          <RefinementList
            attribute={`${modelFieldUUIDs.types}.name_facet`}
            classNames={RefinementListClassNames}
            sortBy={["count:desc"]}
            showMore
            showMoreLimit={200}
            operator="and"
          />
        </MenuSection>
        <MenuSection>
          <RefinementList
            attribute={`${modelFieldUUIDs.county}.names_facet`}
            classNames={RefinementListClassNames}
            sortBy={["name:asc"]}
            operator="and"
          />
        </MenuSection>
      </MenuItems>
    </Menu>
  );
};

export default FacetMenu;
