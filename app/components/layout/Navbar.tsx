import { Link, NavLink, useLocation } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { islands } from "~/config.ts";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"; 

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

      <div className="flex items-center space-x-12 text-white text-lg" style={{ fontFamily: 'Barlow, sans-serif' }}>
        <div className="relative inline-block">
          <button
            onClick={toggleDropdown}
            className="tracking-wide flex items-center space-x-1"
            tabIndex={0}
            style={{ fontFamily: 'Barlow, sans-serif' }} 
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                toggleDropdown();
              }
            }}
          >
            <span>Explore the Coast</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg w-max">
              <ul className="text-black text-lg" style={{ fontFamily: 'Roboto Slab, serif' }}>
                {islands.map((island) => (
                  <li key={island.id} className="p-2 hover:bg-gray-100">
                    <Link to={`/islands/${island.id}-island`}>
                      {island.label} Island
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <NavLink to="/search" className="tracking-wide" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 500 }}>
          Search By Place
        </NavLink>

        <NavLink to="#" className="tracking-wide flex items-center space-x-1" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 500 }}>
          <span>Resources</span>
          <FontAwesomeIcon icon={faChevronDown} /> 
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
