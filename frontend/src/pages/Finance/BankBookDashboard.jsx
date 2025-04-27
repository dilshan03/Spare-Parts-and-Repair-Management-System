import React, { useEffect, useState } from 'react';
import bankIcon from '../../assets/bank_icon.png';
import axios from 'axios';

const BankBookDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    initialBalance: ''
  });
  const [accountError, setAccountError] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const [transactionData, setTransactionData] = useState({
    type: '',
    amount: '',
    remarks: ''
  });
  const [transactionError, setTransactionError] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch bank accounts
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get('http://localhost:5000/api/bank-account',{
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts', err);
      // Set empty accounts array instead of leaving it undefined
      setAccounts([]);
    }
  };

  // Fetch transactions for selected account
  const fetchTransactions = async () => {
    if (!selectedAccount) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:5000/api/bank-book/${selectedAccount._id}/transactions`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      // Set empty transactions array instead of leaving it undefined
      setTransactions([]);
    }
  };

  // Validate account number
  // Format account number with spaces (xxxx xxxx xxxx)
  const formatAccountNumber = (number) => {
    const digits = number.replace(/\s/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const validateAccountNumber = (number) => {
    // Clear any existing error first
    setAccountError('');

    // Remove spaces for validation
    const digits = number.replace(/\s/g, '');

    // Check if empty
    if (!digits) {
      setAccountError('Account number is required');
      return false;
    }

    // Check length
    if (digits.length > 12) {
      setAccountError('Account number cannot exceed 12 digits');
      return false;
    }

    // Check if contains only digits
    if (!/^\d+$/.test(digits)) {
      setAccountError('Account number must contain only digits');
      return false;
    }

    return true;
  };

  // Add a new bank account
  const handleAddAccount = async () => {
    // Validate all required fields
    if (!formData.bankName) {
      alert('Please select a bank');
      return;
    }
    if (!formData.accountNumber) {
      setAccountError('Account number is required');
      return;
    }
    // Remove spaces and validate
    const accountDigits = formData.accountNumber.replace(/\s/g, '');
    if (!validateAccountNumber(accountDigits)) {
      return;
    }
    if (!formData.initialBalance) {
      setBalanceError('Initial balance is required');
      return;
    }
    if (parseFloat(formData.initialBalance) < 0) {
      setBalanceError('Initial balance cannot be negative');
      return;
    }

    try {
      // Remove spaces before sending to API
      const token = localStorage.getItem("token");
      const accountDigits = formData.accountNumber.replace(/\s/g, '');
      await axios.post('http://localhost:5000/api/bank-account/create', {
        ...formData,
        accountNumber: accountDigits,
        initialBalance: parseFloat(formData.initialBalance)
      },{
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ bankName: '', accountNumber: '', initialBalance: '' });
      fetchAccounts();
    } catch (err) {
      console.error('Failed to add account', err);
    }
  };

//Download bank statement pdf
const handleDownloadStatement = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`http://localhost:5000/api/pdf/generate-statement/${selectedAccount._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob', // Ensure the response is a file
    });

    // Create a URL for the PDF Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bank_statement_${selectedAccount._id}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up after download
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download statement', err);
  }
};



  // Delete a bank account
  const handleDeleteAccount = async (accountNumber) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this account?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bank-account/delete/${accountNumber}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      if (selectedAccount?.accountNumber === accountNumber) {
        setSelectedAccount(null);
      }
      fetchAccounts();
    } catch (err) {
      console.error('Failed to delete account', err);
      alert('Error deleting the account.');
    }
  };

  // Add a transaction for the selected account
  const handleAddTransaction = async () => {
    if (!transactionData.type) {
      return alert('Please select a transaction type');
    }
    if (!transactionData.amount) {
      setTransactionError('Amount is required');
      return;
    }
    if (parseFloat(transactionData.amount) <= 0) {
      setTransactionError('Amount must be greater than 0');
      return;
    }
    try {
      const token = localStorage.getItem("token");

      // Log transaction data to check if it's being sent properly
      console.log(transactionData);

      // Post transaction to the backend
      await axios.post(`http://localhost:5000/api/bank-book/${selectedAccount._id}/add-transaction`, {
        transaction_type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        description: transactionData.remarks
      },
    {
      headers: { Authorization: `Bearer ${token}` },
    });

      // Clear the form, error, and refresh transaction list
      setTransactionData({ type: '', amount: '', remarks: '' });
      setTransactionError('');
      fetchTransactions();
      fetchAccounts();
    } catch (err) {
      console.error('Failed to add transaction', err);
    }
  };

  // Fetch bank accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch transactions when the selected account changes
  useEffect(() => {
    if (selectedAccount) fetchTransactions();
  }, [selectedAccount]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center space-x-4">
        <img src={bankIcon} alt="Bank" className="h-10 w-10" />
        <h1 className="text-3xl font-extrabold text-gray-800">
          Bank Book Management
        </h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add Account Card */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Bank Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={formData.bankName}
              onChange={e => setFormData({ ...formData, bankName: e.target.value })}
            >
              <option value="">Select Bank</option>
              <option value="Sampath">Sampath Bank</option>
              <option value="HNB">Hatton National Bank (HNB)</option>
              <option value="Commercial">Commercial Bank</option>
              <option value="Peoples'">People's Bank</option>
            </select>

            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Account Number"
                className={`border ${accountError ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2`}
                value={formData.accountNumber}
                onChange={e => {
                  // Remove non-digits and limit to 12 digits
                  const rawValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                  // Format with spaces
                  const formattedValue = formatAccountNumber(rawValue);
                  setFormData({ ...formData, accountNumber: formattedValue });
                  validateAccountNumber(formattedValue);
                }}
                maxLength="14"  // 12 digits + 2 spaces
              />
              {accountError && (
                <span className="text-red-500 text-sm mt-1">{accountError}</span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                placeholder="Initial Balance"
                className={`border ${balanceError ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:ring focus:ring-blue-200`}
                value={formData.initialBalance}
                min="0"
                step="0.01"
                onKeyDown={e => {
                  // Prevent minus sign
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
                onChange={e => {
                  let value = e.target.value;
                  
                  // Remove any negative signs that might have been pasted
                  value = value.replace(/-/g, '');
                  
                  // Ensure it's a valid positive number
                  const numValue = parseFloat(value);
                  if (isNaN(numValue)) {
                    value = '';
                  } else if (numValue < 0) {
                    value = '0';
                  }
                  
                  setBalanceError('');
                  setFormData({ ...formData, initialBalance: value });
                }}
              />
              {balanceError && (
                <span className="text-red-500 text-sm mt-1">{balanceError}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddAccount}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2 transition"
          >
            Add Account
          </button>
        </section>

        {/* Account List */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Bank Accounts
          </h2>
          <div className="space-y-3">
            {accounts.map(acc => (
              <div
                key={acc._id}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition
                  ${selectedAccount?._id === acc._id ? 'bg-gray-400 border border-black-700 font-bold' : 'bg-gray-100 hover:bg-gray-200'}
                `}
              >
                <button
                  onClick={() => setSelectedAccount(acc)}
                  className="flex-1 text-left"
                >
                  <span className="font-semibold text-gray-800">{acc.bankName}</span> –{' '}
                  <span className="text-gray-800">{acc.accountNumber}</span>{' '}
                  <span className="text-gray-800">(LKR {acc.balance})</span>
                </button>
                <button
                  onClick={() => handleDeleteAccount(acc.accountNumber)}
                  className="ml-4 text-red-600 hover:text-red-800 font-bold"
                  title="Delete Account"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Transactions */}
          {selectedAccount && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Transactions for {selectedAccount.bankName}
              </h2>
              <button
                className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDownloadStatement} // Use the function here
              >
                Download Bank Statement (PDF)
              </button>

            {/* Transaction Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <select
                className="border border-gray-300 rounded px-4 py-2"
                value={transactionData.type}
                onChange={e => setTransactionData({ ...transactionData, type: e.target.value })}
              >
                <option value="">Type</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="bank_charge">Bank Charge</option>
                <option value="unknown_deposit">Unknown Deposit</option>
              </select>
              <div className="flex flex-col">
                <input
                  type="number"
                  placeholder="Amount"
                  className={`border ${transactionError ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2`}
                  value={transactionData.amount}
                  min="0.01"
                  step="0.01"
                  onKeyDown={e => {
                    // Prevent minus sign and 'e'
                    if (e.key === '-' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  onChange={e => {
                    let value = e.target.value;
                    
                    // Remove any negative signs that might have been pasted
                    value = value.replace(/-/g, '');
                    
                    // Ensure it's a valid positive number
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      value = '';
                      setTransactionError('Please enter a valid amount');
                    } else if (numValue <= 0) {
                      setTransactionError('Amount must be greater than 0');
                    } else {
                      setTransactionError('');
                    }
                    
                    setTransactionData({ ...transactionData, amount: value });
                  }}
                />
                {transactionError && (
                  <span className="text-red-500 text-sm mt-1">{transactionError}</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Remarks"
                className="border border-gray-300 rounded px-4 py-2"
                value={transactionData.remarks}
                onChange={e => setTransactionData({ ...transactionData, remarks: e.target.value })}
              />
              <button
                onClick={handleAddTransaction}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-2 transition"
              >
                Add Transaction
              </button>
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions.map(txn => (
                  <li key={txn._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        {txn.transaction_type.replace('_', ' ')} – LKR {txn.amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {txn.description} •{' '}
                        {txn.createdAt && !isNaN(new Date(txn.createdAt)) ? new Date(txn.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default BankBookDashboard;
