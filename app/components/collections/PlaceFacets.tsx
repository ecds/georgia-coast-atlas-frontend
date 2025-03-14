import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ClearRefinements, RefinementList } from "react-instantsearch";

const PlaceList = () => {
  return (
    <RefinementList
      attribute="places"
      operator="or"
      showMore
      classNames={{
        root: "text-sm w-52 md:mb-24",
        label: "flex flex-row gap-2 my-2",
        labelText: "truncate",
        showMore:
          "border text-white capitalize border-island bg-activeIsland hover:bg-activeIsland/40 px-2 py-1 rounded-md",
      }}
    />
  );
};

const PlaceFacets = () => {
  return (
    <>
      <div className="my-4 ms-6 hidden md:block overflow-auto h-full min-w-52">
        <h2 className="text-lg w-">Filter by Place</h2>
        <PlaceList />
      </div>
      <div className="md:hidden mx-4 self-end">
        <Menu>
          <MenuButton className="w-full h-14 bg-activeCounty/50 text-county font-medium mx-2 px-2.5 py-0.5 rounded">
            <FontAwesomeIcon icon={faFilter} />
          </MenuButton>
          <MenuItems
            anchor="bottom"
            transition
            className="w-auto origin-top-right rounded-xl border bg-gray-100 border-black/50 p-4 text-sm/6 text-black/80 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50 me-4"
          >
            <MenuItem>
              <ClearRefinements />
            </MenuItem>
            <MenuItem>
              <PlaceList />
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </>
  );
};

export default PlaceFacets;
