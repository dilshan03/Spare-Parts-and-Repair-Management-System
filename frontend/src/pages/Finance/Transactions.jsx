// src/pages/Transactions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bank-book/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bank-book/delete/${id}`);
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Bank Book Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
                <td>{txn.bank_account_id?.accountNumber || "N/A"}</td>
                <td>{txn.transaction_type}</td>
                <td>{txn.amount}</td>
                <td>{txn.current_balance}</td>
                <td>{txn.description}</td>
                <td>
                  {/* Edit feature can be added here later */}
                  <button
                    onClick={() => deleteTransaction(txn._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/finance-dashboard/add-transaction" className="btn btn-primary mt-3">
        <i className="fas fa-plus-circle"></i> Add New Transaction
      </Link>
    </div>
  );
};

export default Transactions;
