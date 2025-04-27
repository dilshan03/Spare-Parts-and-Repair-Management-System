import React from 'react';
import Navbar from './components/NavBar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard'; 
import RepairRequestFrom from './components/Repair/RepairRequestFrom.jsx';
import Login from './pages/HR/Login.jsx';
import { Toaster } from 'react-hot-toast';

import AdminPanel from './components/AdminPanel';
import EmployeeProfile from './pages/HR/EmployeeProfile'
import LeaveRequest from './pages/HR/LeaveRequest'
import UpdatePassword from './pages/HR/UpdatePassword'
import RepairDashBoard from './pages/Repair/RepairDashBoard.jsx'
import QuotationDashBoard from './pages/Quotation/QuotationDashBoard.jsx'
import ServiceDashboard from './pages/Service/ServiceDashboard.jsx'
import ImportDashboard from './pages/Import/ImportDashboard.jsx'

import FinanceDashboard from './components/Finance/FinanceDashboard.jsx'

import StaffPage from './components/StaffPage';
import AboutUsPage from './components/AboutUsPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AppointmentForm from './components/Service/AppointmentForm.jsx';
//import Sidebar from "./Components/Sidebar"; // Import Sidebar component


function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        
        {/*<Route path="/repair" element={<RepairPage />} />*/}
        {/*<Route path="/service" element={<ServicePage />} />*/}

        <Route path="/" element={<Hero />} /> 
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/staff" element={<StaffPage />} />        
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />


       <Route path="/admin/employees/*" element={<AdminPanel  />} />
        <Route path="/employeeProfile" element={<EmployeeProfile />} />
        <Route path="/employeeProfile/leave" element={<LeaveRequest/>} />
        <Route path="/api/reset-password" element={< UpdatePassword/>} />
        <Route path="/finance-dashboard" element={<FinanceDashboard/>} /> 
        <Route path="/RepairadminDash/*" element={<RepairDashBoard />} />
        <Route path="/QuotationDash/*" element={<QuotationDashBoard />} />
        <Route path="/ServiceDash/*" element={<ServiceDashboard />} />
        <Route path="/appointments/" element={<AppointmentForm />} />
        <Route path="/import/" element={<ImportDashboard />} />
        <Route path="/repairRequestFrom" element={<RepairRequestFrom />} />

      </Routes>
      <Footer />
      {/* <RepairDashBoard/> */}
    </Router>
  );
}

export default App;
