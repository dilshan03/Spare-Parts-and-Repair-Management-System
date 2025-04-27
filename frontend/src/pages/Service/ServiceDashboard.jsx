import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import SideBar from "../../components/SideBar.jsx"; // Import your sidebar component
import AdminPage from "../../components/Service/AdminPage.jsx";
import AppointmentForm from  "../../components/Service/AppointmentForm.jsx";


function DashBoard() {
  return (

    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6"> 
        {/* *********************************************************************** */}
        
 
        <Routes>
            <Route path="/" element={<AdminPage/>} />
            <Route path="/appointments" element={<AppointmentForm/>} />
            
        </Routes>
          {/* ***************************************************************** */}
         
      </div>
    </div>
  );


}


export default DashBoard;


