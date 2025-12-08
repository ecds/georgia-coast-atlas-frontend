import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import gcaLogo from "app/images/gca-logo.png";
// import TopicTree from "./TopicTree";

const itemsAnchor = "bottom";
const itemsClassName =
  "w-52 origin-top-right rounded-xl border bg-island border-black/50 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50";
const menuLinkClassName =
  "block rounded-lg text-white capitalize py-1.5 px-3 data-[focus]:bg-costal-green/50 hover:bg-costal-green/50 text-left";

const collections = ["maps", "panos", "photographs", "videos"];
const aboutPages = ["project", "team", "bibliography", "contact"];
const topics = [
  "agricultural",
  "cartography",
  "environmental-history",
  "gullah-geechee-culture",
  "plantations",
  "sea-level-rise",
  "slavery",
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-costal-green drop-shadow-md">
      {/* Shell / container */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" onClick={closeMobile} className="flex items-center">
            <img
              src={gcaLogo}
              alt="Georgia Coast Atlas Logo"
              className="h-14 w-auto"
            />
          </NavLink>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center space-x-10 text-lg font-barlow text-white md:flex">
          <NavLink
            to="/places"
            className={({ isActive }) =>
              [
                "hover:text-sand-100 transition-colors",
                isActive ? "underline underline-offset-4" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            Places
          </NavLink>

          {/* Collections */}
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex items-center hover:text-sand-100 focus:outline-none">
              Collections
            </MenuButton>
            <MenuItems
              anchor={itemsAnchor}
              className={itemsClassName}
              transition
            >
              {collections.map((collection) => (
                <MenuItem key={collection}>
                  <Link
                    className={menuLinkClassName}
                    to={`/collections/${collection}`}
                  >
                    {collection}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          {/* Topics */}
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex items-center hover:text-sand-100 focus:outline-none">
              Topics
            </MenuButton>
            <MenuItems
              anchor={itemsAnchor}
              className={itemsClassName}
              transition
            >
              {topics.map((topic) => (
                <MenuItem key={topic}>
                  <Link className={menuLinkClassName} to={`/topics/${topic}`}>
                    {topic}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          {/* About */}
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex items-center hover:text-sand-100 focus:outline-none">
              About
            </MenuButton>
            <MenuItems
              anchor={itemsAnchor}
              className={itemsClassName}
              transition
            >
              {aboutPages.map((aboutPage) => (
                <MenuItem key={aboutPage}>
                  <Link
                    className={menuLinkClassName}
                    to={`/about/${aboutPage}`}
                  >
                    {aboutPage}
                  </Link>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-costal-green/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-costal-green md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            // X icon
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
              stroke="currentColor"
              fill="none"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
              stroke="currentColor"
              fill="none"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-costal-green md:hidden">
          <div className="space-y-4 px-4 py-4 text-base font-barlow text-white">
            <Link
              to="/places"
              onClick={closeMobile}
              className="block rounded-md py-2 px-2 hover:bg-costal-green/70"
            >
              Places
            </Link>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Collections
              </div>
              <div className="mt-1 space-y-1">
                {collections.map((collection) => (
                  <Link
                    key={collection}
                    to={`/collections/${collection}`}
                    onClick={closeMobile}
                    className="block rounded-md py-1.5 px-2 capitalize hover:bg-costal-green/70"
                  >
                    {collection}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Topics
              </div>
              <div className="mt-1 space-y-1">
                {topics.map((topic) => (
                  <Link
                    key={topic}
                    to={`/topics/${topic}`}
                    onClick={closeMobile}
                    className="block rounded-md py-1.5 px-2 capitalize hover:bg-costal-green/70"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                About
              </div>
              <div className="mt-1 space-y-1">
                {aboutPages.map((aboutPage) => (
                  <Link
                    key={aboutPage}
                    to={`/about/${aboutPage}`}
                    onClick={closeMobile}
                    className="block rounded-md py-1.5 px-2 capitalize hover:bg-costal-green/70"
                  >
                    {aboutPage}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
