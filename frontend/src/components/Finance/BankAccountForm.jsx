import React, { useState } from "react";
import axios from "axios";

const BankAccountForm = ({ onAccountAdded }) => {
  const [form, setForm] = useState({ bankName: "", accountNumber: "", initialBalance: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/bank-account/create", {
      ...form,
      initialBalance: parseFloat(form.initialBalance),
    });
    setForm({ bankName: "", accountNumber: "", initialBalance: "" });
    onAccountAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold">Add Bank Account</h3>
      <input name="bankName" placeholder="Bank Name" onChange={handleChange} value={form.bankName} className="input" />
      <input name="accountNumber" placeholder="Account Number" onChange={handleChange} value={form.accountNumber} className="input" />
      <input name="initialBalance" type="number" placeholder="Initial Balance" onChange={handleChange} value={form.initialBalance} className="input" />
      <button type="submit" className="btn">Add Account</button>
    </form>
  );
};

export default BankAccountForm;
