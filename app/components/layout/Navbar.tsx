import { NavLink } from "@remix-run/react";
import { islands } from "~/config.ts";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 fixed top-0 w-screen z-50 px-6 pt-6 h-20">
      <ul className="flex flex-row space-x-6 uppercase">
        <li className="text-gray-300">
          <NavLink
            className={({ isActive, isPending }) =>
              isActive ? "bg-white text-black" : isPending ? "pending" : ""
            }
            to="/"
          >
            home
          </NavLink>
        </li>
        {islands.map((island) => {
          return (
            <li key={island.slug} className="text-gray-300">
              <NavLink
                className={({ isActive, isPending }) =>
                  `hover:underline underline-offset-4
                ${
                  isActive
                    ? "underline underline-offset-4 font-bold"
                    : isPending
                    ? "pending"
                    : ""
                }`
                }
                to={`${island.slug}-island`}
              >
                {island.label} Island
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
