import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BalanceSheetList = () => {
  const [balanceSheets, setBalanceSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get('http://localhost:5000/api/balance-sheet/all',{
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setBalanceSheets(response.data);
      })
      .catch(error => {
        console.error('Error fetching balance sheets:', error);
      });
  }, []);

  const handleDownload = async (id, description) => {
    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/balance-sheet/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add the token to the headers
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${description.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setError(null); // Clear previous errors
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download PDF');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (id) => {
    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5000/api/balance-sheet/delete/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Remove deleted balance sheet from state
        setBalanceSheets(prevSheets => prevSheets.filter(sheet => sheet._id !== id));
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete balance sheet');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Balance Sheet List</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}
      {balanceSheets.length === 0 ? (
        <p className="text-center">No balance sheets available.</p>
      ) : (
        <ul className="space-y-4">
          {balanceSheets.map(sheet => (
            <li key={sheet._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{sheet.description}</h3>
                <p className="text-sm text-gray-500">{new Date(sheet.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(sheet._id, sheet.description)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={loading} // Disable when loading
                >
                  {loading ? 'Downloading...' : 'Download PDF'}
                </button> &nbsp; &nbsp;
                <button
                  onClick={() => handleDelete(sheet._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  disabled={loading} // Disable when loading
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BalanceSheetList;
