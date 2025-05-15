import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import SideBar from "../../components/SideBar.jsx"; // Import your sidebar component
import CreateQuotation from "./CreateQuotation.jsx";
import QuotationHistory from "./QuotationHistory.jsx";
import QuotationList from "../../components/Quotation/QuotationList.jsx";
import QuotationDetails from "../../components/Quotation/QuotationDetails.jsx";

function DashBoard() {
  return (

    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6"> 
        {/* *********************************************************************** */}
        {/* <CreateQuotation/> */}
 
        <Routes>
            <Route path="/" element={<CreateQuotation/>} />
            <Route path="/quotations" element={<QuotationList/>} />
            <Route path="/quotations/:id" element={<QuotationDetails/>} />
            
        </Routes>
          {/* ***************************************************************** */}
         
      </div>
    </div>
  );


}


export default DashBoard;


