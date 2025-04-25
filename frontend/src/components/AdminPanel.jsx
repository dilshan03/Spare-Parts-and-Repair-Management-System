import React from "react";
import { Link,useLocation, Routes, Route } from "react-router-dom";
import EmployeeDetails from "../pages/HR/EmployeeDetails";
import SalaryDetails from "../pages/HR/SalaryDetails";
import LeaveDetails from "../pages/HR/LeaveDetails";
import AdminEditEmployee from "../pages/HR/AdminEditEmployee";
import AdminAddEmployee from "../pages/HR/AdminAddEmployee";
import AdminGenarateSalary from "../pages/HR/AdminGenarateSalary";

export default function AdminPanel() {

  const location = useLocation(); // Get the current route

  // Function to check if a link is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Employee Dashboard</h3>

        <div className="space-y-2">
          <Link
            to="/admin/employees/details"
            className={`block px-4 py-2 rounded-lg transition duration-300 ${
              location.pathname === "/admin/employees/details"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            Employee Details
          </Link>

          <Link
            to="/admin/employees/salary"
            className={`block px-4 py-2 rounded-lg transition duration-300 ${
              location.pathname === "/admin/employees/salary"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            Salary Details
          </Link>

          <Link
            to="/admin/employees/leaves"
            className={`block px-4 py-2 rounded-lg transition duration-300 ${
              location.pathname === "/admin/employees/leaves"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            Leave Details
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/edit" element={<AdminEditEmployee />} />
          <Route path="/details" element={<EmployeeDetails />} />
          <Route path="/addemp" element={<AdminAddEmployee />} />
          <Route path="/salary" element={<SalaryDetails />} />
          <Route path="/leaves" element={<LeaveDetails />} />
          <Route path="/salary/new" element={<AdminGenarateSalary />} />
        </Routes>
      </div>
    </div>
  );
}
