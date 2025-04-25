import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GenerateSalary() {

  const [employeeId, setEmployeeId] = useState("");
  const [otHours, setOtHours] = useState(0);
  const [doubleOtHours, setDoubleOtHours] = useState(0);

  const navigate = useNavigate();

  async function handleGenerateSalary() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in as an admin to generate salary.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/salary",
        {
          employeeId,
          otHours,
          doubleOtHours,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success(response.data.message);
      navigate("/admin/employees/salary");

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to generate salary"
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
  <h2 className="text-2xl font-bold mb-4">Generate Salary</h2>

  <label htmlFor="employeeId" className="block">Employee ID</label>
  <input
    id="employeeId"
    type="text"
    placeholder="Employee ID"
    value={employeeId}
    onChange={(e) => setEmployeeId(e.target.value)}
    className="p-2 m-2 w-full border rounded"
  />

  <label htmlFor="otHours" className="block">OT Hours</label>
  <input
    id="otHours"
    type="number"
    placeholder="OT Hours"
    value={otHours}
    onChange={(e) => setOtHours(e.target.value)}
    className="p-2 m-2 w-full border rounded"
  />

  <label htmlFor="doubleOtHours" className="block">Double OT Hours</label>
  <input
    id="doubleOtHours"
    type="number"
    placeholder="Double OT Hours"
    value={doubleOtHours}
    onChange={(e) => setDoubleOtHours(e.target.value)}
    className="p-2 m-2 w-full border rounded"
  />

  <button
    onClick={handleGenerateSalary}
    className="p-2 m-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Generate Salary
  </button>

  <button
    onClick={() => navigate("/admin/employees/salary")}
    className="p-2 m-2 w-full bg-red-500 text-white rounded hover:bg-red-600"
  >
    Cancel
  </button>
</div>

  );
}
