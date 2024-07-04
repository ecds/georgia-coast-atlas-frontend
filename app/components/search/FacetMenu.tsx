import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItems, MenuSection } from "@headlessui/react";
import { Menu as InstantsearchMenu } from "react-instantsearch";
import { modelFieldUUIDs } from "~/config";
import type { MenuCSSClasses } from "node_modules/react-instantsearch/dist/es/ui/Menu";
import FacetDisclosure from "./FacetDisclosure";

const InstantsearchMenuClassNames: Partial<MenuCSSClasses> = {
  count:
    "bg-blue-100 text-blue-800 text-xs font-medium mx-2 px-2.5 py-0.5 rounded",
  item: "py-2 font-light ms-4 text-sm",
  selectedItem: "font-semibold",
  showMore: "text-sm font-light",
};

const FacetMenu = () => {
  return (
    <Menu>
      <MenuButton className="w-full h-14 bg-blue-100 text-blue-800 font-medium mx-2 px-2.5 py-0.5 rounded">
        <FontAwesomeIcon icon={faFilter} />
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        transition
        className="w-auto bg-white p-4 rounded drop-shadow origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 min-w-72"
      >
        <MenuSection className="mb-8">
          <FacetDisclosure title="Type">
            <InstantsearchMenu
              attribute={`${modelFieldUUIDs.types}.name_facet`}
              classNames={InstantsearchMenuClassNames}
              showMore
            />
          </FacetDisclosure>
        </MenuSection>
        <MenuSection>
          <FacetDisclosure title="County">
            <InstantsearchMenu
              attribute={`${modelFieldUUIDs.county}.names_facet`}
              classNames={InstantsearchMenuClassNames}
            />
          </FacetDisclosure>
        </MenuSection>
      </MenuItems>
    </Menu>
  );
};

export default FacetMenu;
