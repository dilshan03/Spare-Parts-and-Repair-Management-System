import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isAfter, isBefore, subMonths } from "date-fns";

const PettyCashManagement = () => {
  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    transactionDate: null,
    id: "",
  });
  // Entries and UI state
  const [entries, setEntries] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  // Monthly allocation persisted in localStorage
  const [allocation, setAllocation] = useState(() => {
    const saved = localStorage.getItem("pettyCashAllocation");
    return saved ? parseFloat(saved) : 0;
  });
  const [allocInput, setAllocInput] = useState(allocation);

  // Month/year display
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[now.getMonth()];
  const year = now.getFullYear();

  useEffect(() => {
    fetchEntries();
  }, []);

  // Fetch all petty cash entries
  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pettycash/",{
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  };

  // Handle allocation input change
  const handleAllocChange = (e) => {
    setAllocInput(e.target.value);
  };
  // Persist allocation
  const handleAllocSubmit = () => {
    const val = parseFloat(allocInput);
    if (isNaN(val) || val < 0) {
      alert("Allocation must be a number >= 0");
      return;
    }
    setAllocation(val);
    localStorage.setItem("pettyCashAllocation", val);
  };

  // Compute spent and remaining
  const totalSpent = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const remaining = allocation - totalSpent;

  // Form input handlers & validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };
  const handleDateChange = (date) => {
    setNewTransaction(prev => ({ ...prev, transactionDate: date }));
    validateInput("transactionDate", date);
  };
  const validateInput = (name, value) => {
    const today = new Date();
    const oneMonthAgo = subMonths(today, 1);
    let newErrors = { ...errors };
    if (name === "amount") {
      const amt = parseFloat(value);
      if (amt <= 0) newErrors.amount = "Amount must be greater than 0.";
      else if (amt > 5000) newErrors.amount = "Amount cannot exceed LKR 5000.";
      else delete newErrors.amount;
    }
    if (name === "transactionDate") {
      if (!value) newErrors.transactionDate = "Date is required.";
      else if (isAfter(value, today)) newErrors.transactionDate = "Future dates are not allowed.";
      else if (isBefore(value, oneMonthAgo)) newErrors.transactionDate = "Date cannot be older than 1 month.";
      else delete newErrors.transactionDate;
    }
    setErrors(newErrors);
  };

  // Submit add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.transactionDate) {
      setErrors({ form: "All fields are required." });
      return;
    }
    if (Object.keys(errors).length) return;
    try {
      // Create a new date with today's time if the selected date is today
    let transactionDateTime;
    const selectedDate = new Date(newTransaction.transactionDate);
    const today = new Date();
    
    if (selectedDate.toDateString() === today.toDateString()) {
      // If the selected date is today, use the current time
      transactionDateTime = new Date();
    } else {
      // If it's a past date, set time to start of that day
      transactionDateTime = selectedDate;
      transactionDateTime.setHours(0, 0, 0, 0);
    }
    
    const payload = { ...newTransaction, transactionDate: transactionDateTime.toISOString() };
      if (newTransaction.id) {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/pettycash/update/${newTransaction.id}`, payload,{
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Transaction updated successfully!");
      } else {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5000/api/pettycash/add", payload,{
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Transaction added successfully!");
      }
      setNewTransaction({ amount: "", description: "", transactionDate: null, id: "" });
      setErrors({});
      fetchEntries();
    } catch (err) {
      setErrors({ submit: err.response?.data || "Failed to add/update transaction." });
    }
  };
  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pettycash/delete/${id}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Transaction deleted successfully!");
      fetchEntries();
    } catch {
      setErrors({ submit: "Failed to delete transaction." });
    }
  };
  // Populate for edit
  const handleUpdate = (entry) => {
    setNewTransaction({
      amount: entry.amount,
      description: entry.description,
      transactionDate: new Date(entry.transactionDate),
      id: entry._id,
    });
  };
  // Generate PDF report
  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/pettycash/generate-report",
         { responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
          });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'petty_cash_report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report: " + (err.response?.data.message || err.message));
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

  return (
    <div className="container mt-4">
      <h2>Petty Cash Management</h2>
      <p>All the expenses under LKR 5000 are considered here.</p>

      {/* Allocation Input */}
      <div className="mb-4">
        <label className="form-label">Set Monthly Allocation (LKR):</label>
        <div className="d-flex">
          <input
            type="number"
            className="form-control me-2"
            value={allocInput}
            onChange={handleAllocChange}
          />
          <button className="btn btn-primary" onClick={handleAllocSubmit}>
            Set Allocation
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className="alert alert-info">
        <strong>Month:</strong> {monthName} {year}<br />
        <strong>Allocated:</strong> LKR {allocation.toFixed(2)}<br />
        <strong>Spent:</strong> LKR {totalSpent.toFixed(2)}<br />
        <strong>Remaining:</strong> LKR {remaining.toFixed(2)}
      </div>

      {/* Petty Cash Form */}
      <div className="col-md-8 mb-4">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5>{newTransaction.id ? "Update Expense" : "Add New Expense"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {errors.form && <p className="text-danger">{errors.form}</p>}
              {errors.submit && <p className="text-danger">{errors.submit}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}

              <div className="form-group mb-3">
                <label>Amount (LKR):</label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
                {errors.amount && <small className="text-danger">{errors.amount}</small>}
              </div>

              <div className="form-group mb-3">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Date:</label>
                <DatePicker
                  selected={newTransaction.transactionDate}
                  onChange={handleDateChange}
                  className="form-control"
                  maxDate={new Date()}
                  minDate={subMonths(new Date(), 1)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                  isClearable
                  showMonthDropdown
                  showYearDropdown
                />
                {errors.transactionDate && (
                  <small className="text-danger">{errors.transactionDate}</small>
                )}
              </div>

              <button type="submit" className="btn btn-success">
                <i className="fas fa-plus-circle"></i>&nbsp; {newTransaction.id ? "Update" : "Add"} Expense
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          <h5>Recorded Expenses</h5>
        </div>
        <div className="card-body">
          {entries.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount (LKR)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry._id}>
                    <td>{formatDate(entry.transactionDate)}</td>
                    <td>{entry.description}</td>
                    <td>{parseFloat(entry.amount).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdate(entry)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Generate Report */}
      <div className="mb-4">
        <button className="btn btn-primary" onClick={handleGenerateReport}>
          Generate Petty Cash Report
        </button>
      </div>
    </div>
  );
};

export default PettyCashManagement;
