import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar.jsx";

export default function ImportDashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Child routes will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
}
