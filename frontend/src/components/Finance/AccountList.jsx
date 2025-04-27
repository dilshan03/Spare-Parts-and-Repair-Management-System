import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bank-account/")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, []);

  return (
    <div>
      <h3>Bank Accounts</h3>
      <ul className="list-group">
        {accounts.map((acc) => (
          <li key={acc._id} className="list-group-item">
            <strong>{acc.bankName}</strong> – {acc.accountNumber} (${acc.balance})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
