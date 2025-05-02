import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ClearRefinements, RefinementList } from "react-instantsearch";

const PlaceFacets = ({
  attribute,
  sortBy,
}: {
  attribute?: string;
  sortBy?: "name" | "count";
}) => {
  return (
    <div className="flex flex-col">
      <div className="mt-4 ms-6 hidden md:block overflow-auto h-full">
        <h2 className="text-lg capitalize">Filter by {attribute ?? "place"}</h2>
        <RefinementList
          attribute={attribute ?? "place_names"}
          operator="or"
          showMore
          showMoreLimit={1000}
          sortBy={[sortBy ?? "count"]}
          classNames={{
            root: "text-sm w-52",
            label: "flex flex-row gap-2 my-2",
            labelText: "truncate",
            showMore:
              "border text-white capitalize border-island bg-island hover:bg-island/40 px-2 py-1 rounded-md",
          }}
        />
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
            <MenuItem></MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default PlaceFacets;
