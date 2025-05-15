import React from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceSheetForm from './BalanceSheetForm'; // Make sure the path is correct

const AddBalanceSheetPage = () => {
  const navigate = useNavigate();

  // Handle the form submission
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/balance-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add balance sheet');
      }

      alert('Balance sheet added successfully!');
      navigate('/balance-sheets'); // redirect to the balance sheet list page
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BalanceSheetForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddBalanceSheetPage;
