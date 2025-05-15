import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddEmployee() {
  const { id } = useParams(); // Get Employee ID from URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    id: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    age: "",
    phone: "",
    role: "",
    employeeType: "",
    salary: "",
    status: ""
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployee(res.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Failed to fetch employee details");
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Add Employee</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <label className="block mb-2">Employee ID:</label>
        <input type="text" name="id" value={employee.id} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Password:</label>
        <input type="password" name="password" value={employee.password} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">First Name:</label>
        <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Last Name:</label>
        <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Email:</label>
        <input type="email" name="email" value={employee.email} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Address:</label>
        <input type="text" name="address" value={employee.address} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Age:</label>
        <input type="number" name="age" value={employee.age} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Phone:</label>
        <input type="text" name="phone" value={employee.phone} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Role:</label>
        <select name="role" value={employee.role} onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
        </select>

        <label className="block mb-2">Employee Type:</label>
        <select name="employeeType" value={employee.employeeType} onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>

        <label className="block mb-2">Salary:</label>
        <input type="number" name="salary" value={employee.salary} onChange={handleChange} className="border p-2 w-full mb-4" />

        <label className="block mb-2">Status:</label>
        <select name="status" value={employee.status} onChange={handleChange} className="border p-2 w-full mb-4">
          <option value="Available">Available</option>
          <option value="Not-Available">Not-Available</option>
        </select>

        <label className="block mb-2">Profile Picture URL:</label>
        <input type="text" name="profilepicture" value={employee.profilepicture} onChange={handleChange} className="border p-2 w-full mb-4" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Employee</button>
      </form>
    </div>
        
     
  );
}
