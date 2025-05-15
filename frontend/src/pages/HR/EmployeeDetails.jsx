import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo.jpg'; 

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

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const img = new Image();
    img.src = logo;
  
    img.onload = function () {
      // Add company logo
      doc.addImage(img, 'JPEG', 15, 10, 30, 30); // Use 'JPEG' or 'PNG'
  
      // Company info
      doc.setFontSize(16);
      doc.text("Cosmo Exports Lanka (PVT) LTD", 60, 20);
      doc.setFontSize(10);
      doc.text("496/1, Naduhena, Meegoda, Sri Lanka", 60, 27);
      doc.text("Phone: +94 77 086 4011  |  +94 11 275 2373", 60, 33);
      doc.text("Email: cosmoexportslanka@gmail.com", 60, 39);
  
      // Title
      doc.setFontSize(14);
      doc.text("Employee Details Report", 14, 55);
      doc.setFontSize(12);
  
      // Table headers and rows
      const headers = [["Employee ID", "Name", "Email", "Birthday", "Age", "Salary", "Address", "Phone", "Role", "Type", "Status"]];

      const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-GB"); // dd/mm/yyyy

      const data = employees.map(emp => [
        emp.id,
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        formatDate(emp.birthday),
        emp.age,
        `LKR ${emp.salary.toLocaleString()}`,
        emp.address,
        emp.phone,
        emp.role,
        emp.employeeType,
        emp.status,
      ]);
  
      autoTable(doc, {
        head: [[
          "Employee ID", "Name", "Email", "Birthday", "Age",
          "Salary", "Address", "Phone", "Role", "Type", "Status"
        ]],
        body: data,
        startY: 65,
        theme: "striped",
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak' // allows long content to wrap
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: 255,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 22 }, // Employee ID
          1: { cellWidth: 28 }, // Name
          2: { cellWidth: 40 }, // Email
          3: { cellWidth: 28 }, // Birthday
          4: { cellWidth: 12 }, // Age
          5: { cellWidth: 22 }, // Salary
          6: { cellWidth: 50 }, // Address (increased)
          7: { cellWidth: 25 }, // Phone
          8: { cellWidth: 20 }, // Role
          9: { cellWidth: 20 }, // Type
          10: { cellWidth: 25 }  // Status
        },
        margin: { top: 60 },
        didDrawPage: function (data) {
          doc.setFontSize(14);
          
        },
        pageBreak: 'auto'
      });
      
      
  
      // Footer
      doc.text("Authorized Signature:", 150, doc.internal.pageSize.height - 30);
      doc.line(150, doc.internal.pageSize.height - 28, 200, doc.internal.pageSize.height - 28);
  
      // Save
      doc.save("Employee_Details_Report.pdf");
    };
  
    img.onerror = function () {
      toast.error("Logo image failed to load. PDF not generated.");
    };
  };
  
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Employee Details</h2>

      <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-800"
        >
          ⬅ Back to Admin Dashboard
        </button>
        <br></br> &nbsp;
        
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

                  <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
    </div>
  );
}
