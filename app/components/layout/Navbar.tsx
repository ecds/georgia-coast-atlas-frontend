import { Link, NavLink } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { ReactNode } from "react";

const NavMenuItems = ({ children }: { children: ReactNode }) => {
  return (
    <MenuItems
      anchor="bottom"
      transition
      className="w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
    >
      {children}
    </MenuItems>
  );
};

const MenuLink = ({ children, to }: { children: ReactNode; to: string }) => {
  return (
    <Link
      to={to}
      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-costal-green/50 hover:bg-costal-green/50"
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-costal-green fixed top-0 w-screen px-6 h-20 flex justify-between items-center z-50">
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
        <NavLink to="/explore">Explore the Coast</NavLink>

        <NavLink
          to="/search"
          className="tracking-wide"
          style={{ fontFamily: "Barlow, sans-serif", fontWeight: 500 }}
        >
          Search By Place <FontAwesomeIcon icon={faSearch} className="ml-1" />
        </NavLink>
        <Menu>
          <MenuButton as={Fragment}>
            {({ active }) => (
              <button>
                About
                <FontAwesomeIcon
                  icon={faChevronDown}
                  rotation={active ? undefined : 180}
                  className="transition-transform duration-100 ease-out ml-1"
                />
              </button>
            )}
          </MenuButton>
          <NavMenuItems>
            <MenuItem>
              <MenuLink to="/about">About</MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/about/bibliography">Bibliography</MenuLink> 
            </MenuItem>
            <MenuItem>
              <MenuLink to="/videos">Videos</MenuLink>
            </MenuItem>
          </NavMenuItems>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
