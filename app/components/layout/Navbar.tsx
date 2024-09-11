import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
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
    <nav className="bg-[#4D4D4D] fixed top-0 w-screen px-6 pt-6 h-20 flex justify-between z-10">
      <ul className="flex flex-row space-x-6 uppercase">
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
              className="w-auto h-12 absolute left-6 top-4"
            />
          </NavLink>
        </li>
      </ul>
      {/* Add the dropdown component here */}
      <div className="relative inline-block mr-6">
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
          <div className="absolute right-8 transform translate-x-1/3 top-full mt-4 bg-white rounded-md shadow-lg w-max">
            <ul className="text-lg text-center">
              {islands.map((island) => (
                <li key={island.id} className="text-left p-2">
                  <Link to={`/islands/${island.id}`}>
                    {island.label} Island
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
