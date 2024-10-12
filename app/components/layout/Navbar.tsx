import { Link, NavLink, useLocation } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] =
    useState<boolean>(false);
  const [isResourceDropdownOpen, setIsResourceDropdownOpen] =
    useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (isExploreDropdownOpen) setIsResourceDropdownOpen(false);
  }, [isExploreDropdownOpen]);

  useEffect(() => {
    if (isResourceDropdownOpen) setIsExploreDropdownOpen(false);
  }, [isResourceDropdownOpen]);

  useEffect(() => {
    setIsExploreDropdownOpen(false);
  }, [location]);

  const toggleExploreDropdown = () => {
    setIsExploreDropdownOpen(!isExploreDropdownOpen);
  };

  const toggleResourceDropdown = () => {
    setIsResourceDropdownOpen(!isResourceDropdownOpen);
  };

  return (
    <nav className="bg-[#4A5D41] fixed top-0 w-screen px-6 h-20 flex justify-between items-center z-10">
      <ul className="flex flex-row space-x-6 items-center ml-6">
        <li>
          <NavLink to="/explore">
            <img
              src={gcaLogo}
              alt="Georgia Coast Atlas Logo"
              className="w-auto h-14"
            />
          </NavLink>
        </li>
      </ul>

      <div
        className="flex items-center space-x-12 text-white text-lg"
        style={{ fontFamily: "Barlow, sans-serif" }}
      >
        <div className="relative inline-block">
          <button
            onClick={toggleExploreDropdown}
            className="tracking-wide flex items-center space-x-1 font-sans"
            tabIndex={0}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                toggleExploreDropdown();
              }
            }}
          >
            <span>Explore the Coast</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              rotation={isExploreDropdownOpen ? undefined : 180}
              className="transition-transform duration-400 ml-1"
            />
          </button>

          {isExploreDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-max">
              <ul className="text-black text-lg font-sans">
                <li className="p-2 hover:bg-gray-100">
                  <Link to="/explore">Islands</Link>
                </li>
                <li className="p-2 cursor-not-allowed">Inland Counties</li>
                {/* {islands.map((island) => (
                  <li key={island.id} className="p-2 hover:bg-gray-100">
                    <Link to={`/islands/${island.id}-island`}>
                      {island.label} Island
                    </Link>
                  </li>
                ))} */}
              </ul>
            </div>
          )}
        </div>

        <NavLink
          to="/search"
          className="tracking-wide"
          style={{ fontFamily: "Barlow, sans-serif", fontWeight: 500 }}
        >
          Search By Place <FontAwesomeIcon icon={faSearch} className="ml-1" />
        </NavLink>

        <div className="relative inline-block">
          <button
            onClick={toggleResourceDropdown}
            className="tracking-wide flex items-center space-x-1 font-sans"
            tabIndex={0}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                toggleResourceDropdown();
              }
            }}
          >
            <span>Resources</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              rotation={isResourceDropdownOpen ? undefined : 180}
              className="transition-transform duration-400 ml-1"
            />
          </button>
          {isResourceDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-max">
              <ul className="text-black text-lg font-sans">
                <li className="p-2 hover:bg-gray-100">
                  <Link to="/about">About</Link>
                </li>
                <li className="p-2 cursor-not-allowed">Videos</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
