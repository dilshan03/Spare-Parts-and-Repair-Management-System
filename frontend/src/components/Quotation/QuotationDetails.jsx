import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const QuotationDetails = () => {
  const { id } = useParams(); // Get the quotation ID from the URL
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quotation details
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/quotations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuotation(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching quotation details:', err);
        setError(err.response?.data?.error || 'Failed to fetch quotation details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  if (loading) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-xl text-red-600 mb-6">{error}</p>
        <Link
          to="/quotations"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors block text-center"
        >
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Quotation Details</h1>
        <div className="space-y-4">
          <p className="text-xl">
            <span className="font-semibold">Customer:</span> {quotation?.customerName}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Email:</span> {quotation?.customerEmail}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Vehicle Number:</span> {quotation?.vehicleNumber}
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">Items:</h2>
            {quotation?.items?.length > 0 ? (
              quotation.items.map((item, index) => (
                <p key={index} className="text-lg">
                  {item.itemName} - {item.quantity} x LKR {item.price}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No items added.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Repairs:</h2>
            {quotation?.repairs?.length > 0 ? (
              quotation.repairs.map((repair, index) => (
                <p key={index} className="text-lg">
                  {repair.repairType} - LKR {repair.price}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No repairs listed.</p>
            )}
          </div>

          <p className="text-xl">
            <span className="font-semibold">Discount:</span> LKR {quotation?.discount}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Total Amount:</span> LKR {quotation?.totalAmount?.toFixed(2)}
          </p>
        </div>

        <Link
          to="QuotationDash/"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors block text-center"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default QuotationDetails;
