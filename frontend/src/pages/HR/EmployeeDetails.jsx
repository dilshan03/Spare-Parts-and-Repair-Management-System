import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Unauthorized: Please log in again.");
    }
  };
  
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
    
    if (!isConfirmed) {
      return; // Exit the function if the user cancels
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Employee Details</h2>

      {employees.length > 0 ?(
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-4">Employee ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Birthday</th>
              <th className="p-4">Age</th>
              <th className="p-4">Salary</th>
              <th className="p-4">Address</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b">
                <td className="p-3">{emp.id}</td>
                <td className="p-3">{emp.firstName} {emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.birthday}</td>
                <td className="p-3">{emp.age}</td>
                <td className="p-3">LKR {emp.salary}</td>
                <td className="p-3">{emp.address}</td>
                <td className="p-3">{emp.phone}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">{emp.employeeType}</td>
                <td className="p-3">{emp.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                    onClick={() => navigate("/admin/employees/edit/", {state:emp})}>
                    Edit
                  </button>
                  
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      ) : (
        <p className="text-center text-gray-600 mt-4">No employees found.</p>
      )}

                  <button
                    className="bg-green-500 text-white px-4 py-1 rounded m-2"
                    onClick={() => navigate(`/admin/employees/addemp`)}
                  >
                    Add Employee
                  </button>
    </div>
  );
}
