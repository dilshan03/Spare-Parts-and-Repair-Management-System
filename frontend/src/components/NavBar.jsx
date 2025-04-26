import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h2 className="text-2xl font-bold text-orange-500">COSMO EXPORTS</h2>
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:text-orange-500 transition-colors duration-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/catalog" className="hover:text-orange-500 transition-colors duration-300">
            Catalog
          </Link>
        </li>
        <li>
          <Link to="/appointments" className="hover:text-orange-500 transition-colors duration-300">
            Book Vehicle Service
          </Link>
        </li>
        <li>
          <Link to="/catalog" className="hover:text-orange-500 transition-colors duration-300">
            Request Repair
          </Link>
        </li>
        <li>
          <Link to="/staff" className="hover:text-orange-500 transition-colors duration-300">
            Staff
          </Link>
        </li>
        <li>
          <Link to="/import" className="hover:text-orange-500 transition-colors duration-300">
            Import vehicle
          </Link>
        </li>
        <li>
          <Link to="/about-us" className="hover:text-orange-500 transition-colors duration-300">
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;