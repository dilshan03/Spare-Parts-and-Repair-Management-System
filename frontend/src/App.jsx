import React from 'react';
import Navbar from './components/NavBar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

import AdminPanel from './components/AdminPanel';
import Login from './pages/Login';
import EmployeeProfile from './pages/EmployeeProfile'
import LeaveRequest from './pages/LeaveRequest'
import UpdatePassword from './pages/UpdatePassword'

import FinanceDashboard from './components/FinanceDashboard'

import StaffPage from './components/StaffPage';
import AboutUsPage from './components/AboutUsPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
//import Sidebar from "./Components/Sidebar"; // Import Sidebar component


function App() {
  return (
    <Router>
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

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
