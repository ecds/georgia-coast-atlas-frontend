import { Link, NavLink } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <nav className="bg-costal-green fixed top-0 w-screen px-6 h-20 flex justify-between items-center z-50 drop-shadow-md">
      <ul className="flex flex-row space-x-6 items-center ml-6">
        <li>
          <NavLink to="/" className="flex items-center">
            <img
              src={gcaLogo}
              alt="Georgia Coast Atlas Logo"
              className="w-auto h-14"
            />
          </NavLink>
        </li>
      </ul>

      <div className="hidden md:flex items-center space-x-12 text-white text-lg font-barlow">
        <NavLink to="/islands">Explore the Coast</NavLink>

        <NavLink
          to="/search"
          className="tracking-wide"
          style={{ fontFamily: "Barlow, sans-serif", fontWeight: 500 }}
        >
          Search By Place
        </NavLink>

        <NavLink to="/topics" className="tracking-wide hover:underline">
          Topics
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
            <MenuItem>
              <MenuLink to="/contact">Contact Us</MenuLink>
            </MenuItem>
          </NavMenuItems>
        </Menu>
      </div>

      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setMenuOpen(false)}
            style={{ top: '80px' }} 
          />
          <div 
            className="fixed right-0 w-64 bg-white text-black shadow-lg z-50 rounded-bl-lg"
            style={{ top: '80px' }}
          >
            <div className="p-4">
              <ul className="space-y-4 text-base font-barlow">
                <li>
                  <NavLink 
                    to="/islands" 
                    className="block py-2 font-medium" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Explore the Coast
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/search" 
                    className="block py-2 font-medium" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Search By Place
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/topics" 
                    className="block py-2 font-medium" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Topics
                  </NavLink>
                </li>

                <li>
                  <button
                    className="flex items-center w-full py-2 font-medium"
                    onClick={() => setAboutOpen(!aboutOpen)}
                  >
                    About
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ml-2 transition-transform ${aboutOpen ? "rotate-180" : ""}`} 
                    />
                  </button>
                  {aboutOpen && (
                    <ul className="mt-2 ml-4 space-y-2 border-l-2 border-costal-green/30 pl-2">
                      <li>
                        <NavLink 
                          to="/about" 
                          className="block py-1 text-sm" 
                          onClick={() => setMenuOpen(false)}
                        >
                          About Us
                        </NavLink>
                      </li>
                      <li>
                        <NavLink 
                          to="/about/bibliography" 
                          className="block py-1 text-sm" 
                          onClick={() => setMenuOpen(false)}
                        >
                          Bibliography
                        </NavLink>
                      </li>
                      <li>
                        <NavLink 
                          to="/videos" 
                          className="block py-1 text-sm" 
                          onClick={() => setMenuOpen(false)}
                        >
                          Videos
                        </NavLink>
                      </li>
                      <li>
                        <NavLink 
                          to="/contact" 
                          className="block py-1 text-sm" 
                          onClick={() => setMenuOpen(false)}
                        >
                          Contact Us
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
