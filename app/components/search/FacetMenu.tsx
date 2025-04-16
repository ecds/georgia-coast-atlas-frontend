import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  Menu,
  MenuButton,
  MenuHeading,
  MenuItems,
  MenuItem,
  MenuSection,
  MenuSeparator,
} from "@headlessui/react";
import {
  ClearRefinements,
  RefinementList,
  useRefinementList,
} from "react-instantsearch";
import { PLACE_TYPES, topBarHeight } from "~/config";
import type { RefinementListClassNames } from "node_modules/react-instantsearch/dist/es/ui/RefinementList";

const bgColor = (
  typeColors: { bgColor: string; textColor: string } | undefined
) => {
  if (!typeColors) {
    return "green-800";
  }
  const shade = parseInt(typeColors.textColor.split("-")[1]);
  if (shade < 500) {
    return typeColors.bgColor;
  }

  return typeColors.textColor;
};

const refinementListClassNames = () => {
  const classNames: Partial<RefinementListClassNames> = {
    checkbox:
      "w-6 h-6 border-gray-300 rounded focus:ring-2 me-2 checked:bg-county",
    count:
      "bg-activeCounty text-white text-xs font-medium mx-2 px-2.5 py-0.5 rounded",
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
      <MenuButton className="w-full h-14 bg-county/50 hover:bg-county/75 drop-shadow-md active:drop-shadow-none text-activeCounty font-medium mx-2 px-2.5 py-0.5 rounded">
        <FontAwesomeIcon icon={faFilter} />{" "}
        <span className="hidden md:block text-xs">Filter</span>
      </MenuButton>
      <MenuItems
        unmount={false}
        anchor={{
          to: "right start",
          offset: 200,
          padding: topBarHeight,
          gap: "2rem",
        }}
        transition
        portal
        className="w-auto max-h-topOffset bg-gray-50 rounded drop-shadow origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 min-w-72"
      >
        <MenuItem>
          {({ close }) => {
            return (
              <div className="flex flex-row w-full justify-between sticky top-0 bg-white px-4 pb-4 pt-4 z-10">
                {/* <MenuSection className=""> */}
                <ClearRefinements
                  classNames={{
                    button:
                      "text-sm bg-island disabled:bg-island/50 disabled:cursor-not-allowed p-2 rounded-md text-white capitalize",
                    disabledButton:
                      "bg-sky-200 hover:bg-sky-100 cursor-not-allowed",
                  }}
                  translations={{
                    resetButtonText: "Clear all",
                  }}
                />
                <button
                  className="border-2 px-2 rounded-md hover:bg-gray-200 drop-shadow-sm hover:drop-shadow-md"
                  title="Close"
                  onClick={close}
                >
                  <FontAwesomeIcon
                    icon={faClose}
                    className="text-black/80 hover:text-black"
                  />
                </button>
              </div>
            );
          }}
        </MenuItem>
        {/* </MenuSection> */}
        <MenuSection className="p-4">
          <MenuHeading className="text-lg text-black/80 mb-1">
            Types
          </MenuHeading>
          <ul>
            {items.map((type, index) => {
              return (
                <li key={type.label} className="flex items-center me-4 my-2">
                  <input
                    type="checkbox"
                    className={`w-6 h-6 text-${bgColor(PLACE_TYPES[type.value])} checked:bg-${bgColor(PLACE_TYPES[type.value])} border-gray-700 rounded focus:ring-${PLACE_TYPES[type.value]?.bgColor ?? "green-800"} focus:ring-2`}
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
            // className={`border-2 rounded-md p-1 capitalize mt-2 bg-gray-200`}
            className="px-3 py-2 mt-2 text-xs capitalize font-medium text-center inline-flex items-center text-black hover:text-white bg-gray-200 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            {isShowingMore ? "show less" : "show more"}
          </button>
        </MenuSection>
        <MenuSeparator className="my-6 h-px bg-black m-4" />
        <MenuSection className="p-4">
          <MenuHeading className="text-lg text-black/80 mb-1">
            Counties
          </MenuHeading>
          <RefinementList
            attribute="county"
            classNames={refinementListClassNames()}
            sortBy={["name:asc"]}
            operator="or"
          />
        </MenuSection>
        <MenuSeparator className="my-6 h-px bg-black m-4" />
        <MenuSection className="p-4">
          <MenuHeading className="text-lg text-black/80 mb-1">
            Media Types
          </MenuHeading>
          <RefinementList
            attribute="media_types"
            classNames={refinementListClassNames()}
            operator="or"
          />
        </MenuSection>
      </MenuItems>
    </Menu>
  );
};

export default FacetMenu;
