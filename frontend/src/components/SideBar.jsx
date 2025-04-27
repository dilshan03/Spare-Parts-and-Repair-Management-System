import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6 shadow-lg">
      <h3 className="mb-6 text-xl font-bold">Admin Panel</h3>
      <nav className="space-y-2">

        <Link to="/finance-dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Finance Dashboard
        </Link>

        <Link to="/admin/employees/details" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Employee Dashboard
        </Link>

        <Link to="/QuotationDash/" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Quotation Dashboard
        </Link>

        <Link to="/RepairadminDash/" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Repair Job Requests
        </Link>

        <Link to="/ServiceDash" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Service Appointments Dashboard
        </Link>
        
        <Link to="/inventory-dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Inventory Dashboard
        </Link>

         <Link to="/import" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Vehicle Import Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
