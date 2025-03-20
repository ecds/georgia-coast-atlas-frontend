import { Link, NavLink } from "@remix-run/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import gcaLogo from "app/images/gca-logo.png";

const itemsAnchor = "bottom";
const itemsClassName =
  "w-52 origin-top-right rounded-xl border bg-activeIsland border-black/50 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50";
const menuLinkClassName =
  "block rounded-lg text-white capitalize py-1.5 px-3 data-[focus]:bg-costal-green/50 hover:bg-costal-green/50";

const collections = ["maps", "panos", "photographs", "videos"];
const aboutPages = ["project", "bibliography", "contact"];

const Navbar = () => {
  return (
    <nav className="bg-costal-green fixed top-0 w-screen px-6 h-20 flex justify-between items-center z-50 drop-shadow-md">
      <ul className="flex flex-row space-x-6 items-center ml-6">
        <li>
          <NavLink to="/">
            <img
              src={gcaLogo}
              alt="Georgia Coast Atlas Logo"
              className="w-auto h-14"
            />
          </NavLink>
        </li>
      </ul>

      <div className="flex items-center space-x-12 text-white text-lg font-barlow">
        <Menu>
          <MenuButton>Places</MenuButton>
          <MenuItems anchor={itemsAnchor} className={itemsClassName} transition>
            <MenuItem>
              <Link className={menuLinkClassName} to="/places/search">
                Search
              </Link>
            </MenuItem>
            <MenuItem>
              <Link className={menuLinkClassName} to="/places/explore">
                Explore
              </Link>
            </MenuItem>
          </MenuItems>
        </Menu>

        <Menu>
          <MenuButton>Collections</MenuButton>
          <MenuItems anchor={itemsAnchor} className={itemsClassName} transition>
            {collections.map((collection) => {
              return (
                <MenuItem key={collection}>
                  <Link
                    className={menuLinkClassName}
                    to={`/collections/${collection}`}
                  >
                    {collection}
                  </Link>
                </MenuItem>
              );
            })}
          </MenuItems>
        </Menu>

        <NavLink
          to="/topics"
          className="tracking-wide hover:underline text-white hover:text-white/80"
        >
          Topics
        </NavLink>

        <Menu>
          <MenuButton>About</MenuButton>
          <MenuItems anchor={itemsAnchor} className={itemsClassName} transition>
            {aboutPages.map((aboutPage) => {
              return (
                <MenuItem key={aboutPage}>
                  <Link
                    className={menuLinkClassName}
                    to={`/about/${aboutPage}`}
                  >
                    {aboutPage}
                  </Link>
                </MenuItem>
              );
            })}
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
