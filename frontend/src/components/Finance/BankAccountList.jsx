import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BankAccountList({ refresh }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/bank-account")
      .then((res) => {
        console.log("Bank accounts fetched:", res.data);
        setAccounts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching accounts:", err);
        setAccounts([]);
      });
  }, [refresh]);

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        accounts.map((acc) => (
          <div
            key={acc._id}
            className="border p-4 rounded bg-gray-50 flex flex-col"
          >
            <span className="font-semibold text-lg">{acc.bankName}</span>
            <span>Account #: {acc.accountNumber}</span>
            <span>Balance: ${acc.balance.toFixed(2)}</span>
          </div>
        ))
      )}
    </div>
  );
}
