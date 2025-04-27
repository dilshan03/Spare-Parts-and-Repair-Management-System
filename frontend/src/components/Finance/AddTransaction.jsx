import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



const AddTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchFilters, setSearchFilters] = useState({
        startDate: null,
        endDate: null,
        type: '',
        description: ''
    });
    const [formData, setFormData] = useState({
        type: 'income',
        description: '',
        amount: '',
        date: null,
        specificDescription: '',
    });

    const navigate = useNavigate();

    // Fetch transactions from API
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/api/finance',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data);
            setFilteredTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle date filter changes
    const handleDateFilterChange = (date, field) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: date
        }));
    };

    // Apply filters and sort
    const applyFilters = () => {
        let filtered = [...transactions];

        // Filter by date range
        if (searchFilters.startDate) {
            filtered = filtered.filter(txn => 
                new Date(txn.timestamp) >= new Date(searchFilters.startDate)
            );
        }
        if (searchFilters.endDate) {
            const endDate = new Date(searchFilters.endDate);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(txn => 
                new Date(txn.timestamp) <= endDate
            );
        }

        // Filter by type
        if (searchFilters.type) {
            filtered = filtered.filter(txn =>
                txn.type.toLowerCase().includes(searchFilters.type.toLowerCase())
            );
        }

        // Filter by description
        if (searchFilters.description) {
            filtered = filtered.filter(txn =>
                txn.description.toLowerCase().includes(searchFilters.description.toLowerCase())
            );
        }

        // Sort by date in ascending order
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setFilteredTransactions(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchFilters({
            startDate: null,
            endDate: null,
            type: '',
            description: ''
        });
        setFilteredTransactions(transactions);
    };

    // Effect to apply filters when filters change
    useEffect(() => {
        applyFilters();
    }, [searchFilters, transactions]);

    // Handle form input changes
    const handleChange = (e) => {
        if (e.target.name === 'amount') {
            const value = parseFloat(e.target.value);
            if (value < 0) {
                setErrorMessage('Amount cannot be negative');
                return;
            }
            setErrorMessage('');
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Date validation
    const handleDateChange = (selectedDate) => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
    
        if (selectedDate > today) {
            setErrorMessage('Date cannot be in the future.');
        } else if (selectedDate < oneMonthAgo) {
            setErrorMessage('Date cannot be more than a month old.');
        } else {
            setErrorMessage('');
        }
    
        setFormData({ ...formData, date: selectedDate });
    };
    

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errorMessage) return;

        // Validate all required fields
        const requiredFields = ['type', 'amount', 'date'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        
        // Check if description is required
        if (formData.type === 'other' && !formData.specificDescription) {
            emptyFields.push('specificDescription');
        } else if (formData.type !== 'other' && !formData.description) {
            emptyFields.push('description');
        }

        if (emptyFields.length > 0) {
            setErrorMessage(`Please fill in all required fields: ${emptyFields.join(', ')}`);
            return;
        }
      
        // Handle timestamp creation
        let timestamp;
        if (!formData.date) {
            timestamp = new Date().toISOString();
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            
            // Check if selected date is today
            const isToday = selectedDate.getDate() === today.getDate() &&
                           selectedDate.getMonth() === today.getMonth() &&
                           selectedDate.getFullYear() === today.getFullYear();

            if (isToday) {
                timestamp = new Date().toISOString(); // Use current time for today
            } else {
                // Set time to midnight (12 AM) for other dates
                selectedDate.setHours(0, 0, 0, 0);
                timestamp = selectedDate.toISOString();
            }
        }

        const payload = {
          type: formData.type,
          description: formData.type === 'other' ? formData.specificDescription : formData.description,
          amount: parseFloat(formData.amount),
          timestamp: timestamp,
          approved: false
        };
      
        try {
            const token = localStorage.getItem("token");
          const response = await axios.post('http://localhost:5000/api/finance/add', payload,{
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 201) {
            setErrorMessage('');
            alert('Transaction added successfully!');
            setFormData({ type: 'income', description: '', amount: '', date: null, specificDescription: '' });
            fetchTransactions();
          }
        } catch (error) {
          console.error('Error adding transaction:', error.response?.data || error.message);
          alert('Server error. Please try again later.');
        }
      };
      

    // Handle transaction deletion
    const handleDelete = async (transactionId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/finance/delete/${transactionId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(transactions.filter(txn => txn._id !== transactionId));
            alert('Transaction deleted successfully!');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Server error. Please try again later.');
        }
    };

    // Export as PDF
    /*const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Transaction Report", 20, 10);

        const tableColumn = ["Type", "Amount", "Date", "Description"];
        const tableRows = transactions.map(txn => [
            txn.type,
            `LKR ${txn.amount}`,
            txn.date,
            txn.description,
        ]);

        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("transaction_report.pdf");
    };*/

    // Export as PDF
    const exportToPDF = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/finance/reports/pdf', 
            { responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/pdf',
            },
             });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'transaction_report.pdf';
        link.click();
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
    };



    // Export as Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(transactions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "transaction_report.xlsx");
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl shadow-lg rounded-lg bg-white">
            <h2 className="text-2xl font-semibold mb-6 ">Add New Transaction</h2>

            {/* Add Transaction Form with Export Buttons */}
            <div className="d-flex justify-content-between items-center mb-4">
                <div className="text-lg font-semibold"></div>
                <div className="flex space-x-2">
                    <button className="btn btn-outline-primary px-4 py-2 rounded-md" onClick={exportToPDF}>
                        <i className="fas fa-file-pdf mr-2"></i> Export PDF
                    </button>
                    <button className="btn btn-outline-success px-4 py-2 rounded-md" onClick={exportToExcel}>
                        <i className="fas fa-file-excel mr-2"></i> Export Excel
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-md shadow-sm">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                {/* Description Dropdown */}
                <select name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-md shadow-sm">
                    <option value="">Select Description</option>
                    {formData.type === "income" ? (
                        <>
                            <option value="spare_parts_sale">Spare Parts Sale Income</option>
                            <option value="repair_service">Repair Service Income</option>
                            <option value="import_vehicle">Import Vehicle Income</option>
                            <option value="vehicle_service">Vehicle Service Booking Income</option>
                            <option value="other">Other</option>
                        </>
                    ) : (
                        <>
                            <option value="salary">Salary</option>
                            <option value="taxes">Taxes</option>
                            <option value="utility_bills">Utility Bills</option>
                            <option value="repair_maintenance">Repair Equipment Maintenance</option>
                            <option value="shipment">Spare Parts Shipment</option>
                            <option value="other">Other</option>
                        </>
                    )}
                </select>

                {/* Other Description Input */}
                {formData.description === "other" && (
                    <input
                        type="text"
                        name="specificDescription"
                        placeholder="Enter description"
                        value={formData.specificDescription}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md shadow-sm"
                    />
                )}

                {/* Amount Input */}
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount (LKR)"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full p-3 border rounded-md shadow-sm"
                />

                {/* Date Input */}
                {/*<input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    required
                    className="w-full p-3 border rounded-md shadow-sm"
                />*/}

                <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    maxDate={new Date()}
                    minDate={(() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() - 1);
                        return d;
                    })()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    className="w-full p-3 border rounded-md shadow-sm"
                />


                {/* Error Message */}
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600">
                    Add Transaction
                </button>
            </form>

            {/* Search and Filter Section */}
            <div className="mt-8 mb-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold mb-4">Search & Filter Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <DatePicker
                            selected={searchFilters.startDate}
                            onChange={(date) => handleDateFilterChange(date, 'startDate')}
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select start date"
                            maxDate={searchFilters.endDate || new Date()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <DatePicker
                            selected={searchFilters.endDate}
                            onChange={(date) => handleDateFilterChange(date, 'endDate')}
                            className="w-full p-2 border rounded-md"
                            placeholderText="Select end date"
                            minDate={searchFilters.startDate}
                            maxDate={new Date()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <input
                            type="text"
                            name="type"
                            value={searchFilters.type}
                            onChange={handleFilterChange}
                            placeholder="Filter by type"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={searchFilters.description}
                            onChange={handleFilterChange}
                            placeholder="Filter by description"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="mt-4">
                <h3 className="text-lg font-bold">Transaction History</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
                <table className="table-auto w-full border mt-2">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn) => (
                            <tr key={txn._id} className="border">
                                <td className="border p-2">{txn.type}</td>
                                <td className="border p-2">LKR {txn.amount}</td>
                                <td className="border p-2">{new Date(txn.timestamp).toLocaleString()}</td>
                                <td className="border p-2">{txn.description}</td>
                                <td className="border p-2">
                                    <button onClick={() => handleDelete(txn._id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddTransaction;
