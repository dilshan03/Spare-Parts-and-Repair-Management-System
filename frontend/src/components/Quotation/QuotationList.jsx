import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);

  // // Fetch all quotations
  // useEffect(() => {
  //   const fetchQuotations = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get('http://localhost:5000/api/quotations', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       setQuotations(response.data);
  //     } catch (err) {
  //       console.error('Error fetching quotations:', err);
  //     }
  //   };
  //   fetchQuotations();
  // }, []);

  // // Delete a quotation
  // const handleDelete = async (id) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`http://localhost:5000/api/quotations/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setQuotations((prev) => prev.filter((q) => q._id !== id));
  //     alert('Quotation deleted successfully');
  //   } catch (err) {
  //     console.error('Error deleting quotation:', err);
  //     alert('Error deleting quotation');
  //   }
  // };

  // // Update status to accepted or rejected
  // const handleStatusUpdate = async (id, status) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.put(`http://localhost:5000/api/quotations/${id}/status`, { status }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     console.log('Updated Quotation:', response.data); // Debugging response
  //     setQuotations((prev) =>
  //       prev.map((q) => (q._id === id ? { ...q, status: response.data.status } : q))
  //     );
  //     alert(`Quotation status updated to ${status}`);
  //   } catch (err) {
  //     console.error('Error updating status:', err.response ? err.response.data : err.message);
  //     alert('Error updating status');
  //   }
  // };

  // Fetch all quotations
useEffect(() => {
  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/quotations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotations(response.data);
    } catch (err) {
      console.error('Error fetching quotations:', err);
    }
  };
  fetchQuotations();
}, []);

// Delete a quotation
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/quotations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuotations((prev) => prev.filter((q) => q._id !== id));
    alert('Quotation deleted successfully');
  } catch (err) {
    console.error('Error deleting quotation:', err);
    alert('Error deleting quotation');
  }
};

// Update status to accepted or rejected
const handleStatusUpdate = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:5000/api/quotations/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Updated Quotation:', response.data); // Debugging response
    setQuotations((prev) =>
      prev.map((q) => (q._id === id ? { ...q, status: response.data.status } : q))
    );
    alert(`Quotation status updated to ${status}`);
  } catch (err) {
    console.error('Error updating status:', err.response ? err.response.data : err.message);
    alert('Error updating status');
  }
};

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Quotation List</h1>
      <ul className="space-y-4">
        {quotations.map((quotation) => (
          <li key={quotation._id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-semibold">Customer: {quotation.customerName}</p>
              <p className="text-gray-600">
                Vehicle: {quotation.vehicleNumber} | Total: LKR {quotation.totalAmount.toFixed(2)} | Status: {quotation.status}
              </p>
              <div className="flex space-x-4">
                <Link
                  to={`${quotation._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(quotation._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                {/* Buttons to update the status */}
                {quotation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(quotation._id, 'Accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(quotation._id, 'Rejected')}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuotationList;