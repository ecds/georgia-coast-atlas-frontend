import { NavLink } from "@remix-run/react";
import gcaLogo from 'app/images/gca-logo.png';

const Navbar = () => {
  return (
    <nav className="bg-[#4D4D4D] fixed top-0 w-screen z-50 px-6 pt-6 h-20">
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
    </nav>
  );
};

export default Navbar;