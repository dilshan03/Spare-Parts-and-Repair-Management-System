import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RepairRequestForm from "../../Components/Repair/RepairRequestFrom.jsx"; // Import your components
import JobCardCreate from '../../components/Repair/JobCardCreate.jsx';
import JobCardUpdateDelete from '../../Components/Repair/JobCardUpdateDelete.jsx';
import JobCardUpdateMechnic from '../../components/Repair/JobCardUpdateMechnic.jsx';
import JobCardListForMechnic from '../../components/Repair/JobCardListForMechnic.jsx';
import RepairRequestFromUpdate from "../../Components/Repair/RepairRequestFromUpdate.jsx";
// import JobCardCreate from "./JobCardCreate";
import RepairRequestList from "../../Components/Repair/RepairRequestList.jsx";
import RepairList from "../../Components/Repair/RepairList";  
import JobCardList from "../../Components/Repair/JobCardList";
import SideBar from "../../components/SideBar.jsx"; // Import your sidebar component
// import RepairTable from "./RepairTable";

function DashBoard() {
  return (

    

    
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        {/* <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> */}
        {/* *********************************************************************** */}
          <div style={styles.body}>
        {/* Header Navigation Bar */}
          <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            {/* <b>B</b> */}
            Repair Management System
          </h2>
          <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>
              <i className="fas fa-home"> </i> Repair Home
            </Link>
            <Link to="/RepairadminDash/RepairReqList" style={styles.navLink}>
              <i className="fas fa-box"> </i> Repair Requests
            </Link>
            <Link to="/RepairadminDash/AllRepair" style={styles.navLink}>
              <i className="fas fa-plus "></i> Repair
            </Link>
            <Link to="/RepairadminDash/jobCardList" style={styles.navLink}>
              <i className="fas fa-users"></i> All Job Cards 
            </Link>
            <Link to="/RepairadminDash/mechnicalJobs" style={styles.navLink}>
              <i className="fas fa-users"></i> Mechnicals jobs 
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <Routes>
            <Route path="/RepairReqFrom" element={<RepairRequestForm />} />
            <Route path="/RepairReqList" element={<RepairRequestList />} />
            <Route path="/repair-requests/:id" element={<RepairRequestFromUpdate />} />
            {/* <Route path="/jobcards" element={<RepairTable />} /> */}
            <Route path="/jobcard-create/:repairId" element={<JobCardCreate/>} />
            <Route path="/AllRepair" element={<RepairList/>} />
            <Route path="/jobCardList" element={<JobCardList/>} /> 
            {/* <Route path="/jobCardList" element={<JobCardUpdateMechanic/>} />  */}
            <Route path="/jobCards/:id" element={<JobCardUpdateDelete/>} />
            <Route path="/jobCards/mechnic/:id" element={<JobCardUpdateMechnic/>} />
            <Route path="/mechnicalJobs" element={<JobCardListForMechnic/>} />
          </Routes>
      
      </div>
    </div>
 
          {/* ***************************************************************** */}
         
      </div>
    </div>
  );


}

// Styles
const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    margin: 0,
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
  },
};

export default DashBoard;


