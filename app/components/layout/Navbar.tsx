import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons"; // Import the search icon
import { Link, NavLink, useLocation } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { islands } from "~/config.ts";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#4D4D4D] fixed top-0 w-screen px-6 h-20 flex justify-between items-center z-10">
      <ul className="flex flex-row space-x-6 uppercase items-center">
        <li>
          <NavLink
            className={({ isActive, isPending }) =>
              isPending ? "pending" : "no-underline"
            }
            to="/"
          >
            <img
              src={gcaLogo}
              alt="Georgia Coast Atlas Logo"
              className="w-auto h-12"
            />
          </NavLink>
        </li>
      </ul>
      
      <div className="flex items-center space-x-6">
        {/* Search Button */}
        <NavLink to="/search" className="text-white text-2xl">
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>

        {/* Dropdown Menu */}
        <div className="relative inline-block">
          <button
            onClick={toggleDropdown}
            className="flex justify-center text-3xl text-white"
            tabIndex={0}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                toggleDropdown();
              }
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-4 bg-white rounded-md shadow-lg w-max">
              <ul className="text-lg text-center">
                {islands.map((island) => (
                  <li key={island.slug} className="text-left p-2">
                    <Link to={`/${island.slug}-island`}>
                      {island.label} Island
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
