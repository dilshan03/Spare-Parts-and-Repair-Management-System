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
        
      </div>
    </div>
  );
};

export default AdminDashboard;
