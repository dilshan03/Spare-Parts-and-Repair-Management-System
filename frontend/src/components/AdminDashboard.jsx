import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./ui/Card";
import SideBar from "./SideBar"; // ✅ Import Sidebar
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
    console.log("Fetching finance transactions...");
    axios.get("http://localhost:5000/api/finance/")
      .then(res => {
        console.log("API Response:", res.data);
        setTransactions(res.data);
        const aggregatedData = aggregateRevenueExpensesByDate(res.data);
        setRevenueExpenseData(aggregatedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Fetch Error:", err);
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

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Bar Chart - Total Transactions per Day */}
            <Card className="p-4 mb-4" style={{ minHeight: "400px" }}>
              <h2 className="text-lg font-semibold">Financial Overview</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueExpenseData} margin={{ bottom: 40 }}>
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4F46E5" name="Total Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Line Chart - Revenue & Expenses Trend */}
            <Card className="p-4 mb-4" style={{ minHeight: "400px" }}>
              <h2 className="text-lg font-semibold">Revenue & Expenses Trend</h2>
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
            </Card>
          </>
        )}

        {/* Total Revenue & Expense Boxes */}
        <div className="flex justify-between gap-4">
          <div className="flex flex-col items-center bg-green-100 border border-green-400 text-green-800 rounded-lg p-4 w-1/2 shadow-md">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold">LKR {totalRevenue.toFixed(2)}</p>
          </div>

          <div className="flex flex-col items-center bg-red-100 border border-red-400 text-red-800 rounded-lg p-4 w-1/2 shadow-md">
            <h3 className="text-lg font-semibold">Total Expenses</h3>
            <p className="text-2xl font-bold">LKR {totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
