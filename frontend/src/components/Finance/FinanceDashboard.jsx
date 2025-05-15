import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../SideBar.jsx";

import AddTransaction from "./AddTransaction";
import PaymentPortal from "./PaymentPortal";
import PettyCashManagement from "./PettyCashManagement";
import BalanceSheetForm from "./BalanceSheetForm";
import BalanceSheetList from "./BalanceSheetList";
import ProfitLossManagement from "./ProfitLossManagement";
import BankBookDashboard from "../../pages/Finance/BankBookDashboard";

const FinanceDashboard = () => {
  const [reports, setReports] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/finance/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleDownload = async (type) => {
    let url = "";
    let filename = "";

    switch (type) {
      case "pdf":
        url = "http://localhost:5000/api/finance/reports/pdf";
        filename = "transaction-history.pdf";
        break;
      case "excel":
        url = "http://localhost:5000/api/finance/reports/excel";
        filename = "transaction-history.xlsx";
        break;
      default:
        console.error("Invalid report type:", type);
        return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(url, {
        responseType: "blob",
        headers: { 
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], {
        type: type.includes("pdf")
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Finance Dashboard</h2>

        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-800"
        >
          ⬅ Back to Admin Dashboard
        </button>
        <br></br> &nbsp;
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { label: "Dashboard", value: "dashboard" },
            { label: "Transaction Management", value: "add-transaction" },
            { label: "Bank Book Management", value: "bank-book"},
            { label: "Petty Cash Management", value: "petty-cash" },
            { label: "Balance Sheet Management", value: "add-balance-sheet" },
            { label: "Balance Sheet List", value: "balance-sheet" },
            { label: "Profit & Loss Statement", value: "profit-loss" },
            { label: "Payment Portal", value: "payment-portal" },
            
          ].map((tab) => (
            <button
              key={tab.value}
              className={`w-48 text-white px-4 py-2 rounded-lg ring-2 ring-blue-300 hover:opacity-90 ${
                activeTab === tab.value
                  ? "bg-blue-700"
                  : tab.bg
                  ? `bg-[${tab.bg}]`
                  : "bg-blue-500"
              }`}
              onClick={() => tab.path ? navigate(tab.path) : setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-700 underline">Financial Reports</h4>
            {reports ? (
              <>
                <p className="mt-4 text-lg">
                  <strong>Revenue:</strong> LKR {reports.profitLoss.revenue} &nbsp;|&nbsp;
                  <strong>Expenses:</strong> LKR {reports.profitLoss.expenses} &nbsp;|&nbsp;
                  <strong>Profit:</strong> LKR {reports.profitLoss.profit}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={() => handleDownload("pdf")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Download Transaction History PDF
                  </button>
                  <button
                    onClick={() => handleDownload("excel")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Download Transaction History Excel
                  </button>

                  
                  
                </div>
              </>
            ) : (
              <p className="text-gray-600 mt-4">Loading report data...</p>
            )}
          </div>
        )}

        {activeTab === "add-transaction" && <AddTransaction />}
        {activeTab === "bank-book" && <BankBookDashboard />}
        {activeTab === "petty-cash" && <PettyCashManagement />}
        {activeTab === "add-balance-sheet" && <BalanceSheetForm />}
        {activeTab === "balance-sheet" && <BalanceSheetList />}
        {activeTab === "payment-portal" && <PaymentPortal />}
        {activeTab === "profit-loss" && <ProfitLossManagement />}
      </div>
    </div>
  );
};

export default FinanceDashboard;
