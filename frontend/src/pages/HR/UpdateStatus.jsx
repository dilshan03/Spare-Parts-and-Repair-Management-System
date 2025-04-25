import React, { useState } from "react";
import axios from "axios";

export default function UpdateStatus({ user }) {
  const [status, setStatus] = useState(user.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/employees/${user.id}`, { status })
      .then(() => alert("Status Updated Successfully"))
      .catch(() => alert("Error updating status"));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Status</h2>

      <label className="block mb-2 text-gray-700">Select Status:</label>
      <select
        className="border p-2 w-full mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Available">Available</option>
        <option value="Not-Available">Not-Available</option>
      </select>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  );
}
