import React, { useState } from "react";
import axios from "axios";

const BankSlipUpload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bankSlip", file);
    await axios.post("http://localhost:5000/api/payments/upload", formData);
    alert("Bank Slip Uploaded Successfully");
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default BankSlipUpload;
