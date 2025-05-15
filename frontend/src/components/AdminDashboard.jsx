import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./ui/Card";
import SideBar from "./SideBar";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, 
  LineChart, Line 
} from "recharts";

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueExpenseData, setRevenueExpenseData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    axios.get('http://localhost:5000/api/finance/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setTransactions(res.data);
      setRevenueExpenseData(aggregateRevenueExpensesByDate(res.data));
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to fetch transactions");
      setLoading(false);
    });
  }, []);
  

  const aggregateRevenueExpensesByDate = (transactions) => {
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, expenses: 0 };
      }
      if (transaction.type === "income") {
        acc[date].revenue += transaction.amount;
      } else if (transaction.type === "expense") {
        acc[date].expenses += transaction.amount;
      }
      return acc;
    }, {});
    return Object.values(groupedData);
  };

  const totalRevenue = revenueExpenseData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueExpenseData.reduce((sum, item) => sum + item.expenses, 0);

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Dashboard Header */}
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {loading ? (
          <p className="text-gray-500 text-center">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Bar Chart */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueExpenseData} margin={{ bottom: 40 }}>
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4F46E5" name="Total Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Revenue & Expenses Trend</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueExpenseData}>
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#22C55E" name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center bg-green-100 border border-green-400 text-green-800 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold">LKR {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-center bg-red-100 border border-red-400 text-red-800 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-2xl font-bold">LKR {totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;