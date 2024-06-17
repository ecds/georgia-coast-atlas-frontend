import { NavLink, useNavigate } from "@remix-run/react";
import gcaLogo from "app/images/gca-logo.png";
import { islands } from "~/config.ts";
import { useState } from "react";
import islandsButtonImage from "app/images/islandsButton.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#4D4D4D] fixed top-0 w-screen z-50 px-6 pt-6 h-20 flex justify-between">
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
          className="flex justify-center"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleDropdown();
            }
          }}
        >
          <img src={islandsButtonImage} alt="Islands Button" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-1 transform translate-x-1/3 top-full mt-2 bg-white rounded-md shadow-lg w-64">
            <ul className="font-serif text-lg text-center">
              {islands.map((island) => (
                <li key={island.slug}>
                  <button
                    className="px-6 py-3 hover:bg-gray-200 w-full text-left"
                    onClick={() => {
                      navigate(`/${island.slug}-island`);
                      setIsDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/${island.slug}-island`);
                        setIsDropdownOpen(false);
                      }
                    }}
                  >
                    {island.label} Island
                  </button>
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
