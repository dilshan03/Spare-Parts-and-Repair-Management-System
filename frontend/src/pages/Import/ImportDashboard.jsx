import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import SideBar from "../../components/SideBar.jsx";
import AdminPanel from "./AdminPanel.jsx";
import AvailableModels from "./AvailableModels.jsx";
import CustomerRequests from "./CustomerRequests.jsx";

function DashBoard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        {/* Routes will be rendered inside the Outlet */}
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/vehicles" element={<AvailableModels />} />
          <Route path="/admin/requests" element={<CustomerRequests />} />
        </Routes>
      </div>
    </div>
  );
}

export default DashBoard;
