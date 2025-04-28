import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Routes, Route} from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import JobCardListForMechnic2 from "../../components/Repair/JobCardListForMechnic2.jsx";
import JobCardUpdateMechnic2 from "../../components/Repair/JobCardUpdateMechnic2.jsx";


export default function EmployeeProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [birthday] = useState(location.state.birthday);
  const calculatedAge = calculateAgeFromBirthday(birthday);

  // Extract employee details from state
  const employee = location.state || {};

  const empId = location?.state?.id;
  const [firstName] = useState(location.state.firstName);
  const [lastName] = useState(location.state.lastName);
  const [email] = useState(location.state.email);
  const [address] = useState(location.state.address);
  const [age] = useState(location.state.age);
  const [phone] = useState(location.state.phone);
  const [role] = useState(location.state.role);
  const [employeeType] = useState(location.state.employeeType);
  const [salary] = useState(location.state.salary);
  const [status, setStatus] = useState(location.state.status);

  const [salaryDetails, setSalaryDetails] = useState(null); //to fecth salary

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token && empId) {
      axios
        .get(`http://localhost:5000/api/salary/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const salaries = res.data;
  
          if (Array.isArray(salaries) && salaries.length > 0) {
            const latestSalary = salaries[salaries.length - 1]; // or sort by date if needed
            setSalaryDetails(latestSalary);
          } else {
            setSalaryDetails(null);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch salary details");
        });
    }
  }, [empId]);

  // Function to update status
  async function updateStatus(newStatus) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login and retry");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/employees/${empId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus(newStatus); // Update UI state after a successful update
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }

  function calculateAgeFromBirthday(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-lightblue-300">
      <div className="bg-#111827 text-black p-6 rounded-lg shadow-lg w-[800px] border border-gray-900">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase">Employee Profile</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-2xl">Employee ID:</label>
            <input value={empId} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">First Name:</label>
            <input value={firstName} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Last Name:</label>
            <input value={lastName} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Email:</label>
            <input value={email} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-2">
            <label className="block text-2xl">Address:</label>
            <input value={address} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Birthday:</label>
            <input value={birthday} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>

          <div className="col-span-1">
            <label className="block text-2xl">Age:</label>
            <input value={calculatedAge} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Phone:</label>
            <input value={phone} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Role:</label>
            <input value={role} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Employee Type:</label>
            <input value={employeeType} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>
          <div className="col-span-1">
            <label className="block text-2xl">Salary:</label>
            <input value={salary} disabled className="w-full p-2 border rounded bg-gray-200 text-black" />
          </div>

          {salaryDetails && (
            <div className="col-span-2 mt-6 bg-white text-black p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Salary Breakdown</h2>
              <p><strong>Basic Salary:</strong> LKR {salaryDetails.basicSalary}</p>
              <p><strong>Double OT Hours:</strong> {salaryDetails.doubleOtHours}</p>
              <p><strong>OT Hours:</strong> {salaryDetails.otHours}</p>
              <p><strong>OT Pay:</strong> LKR {salaryDetails.otPay}</p>
              <p><strong>EPF (Employee 8%):</strong> LKR {salaryDetails.epfEmployee}</p>
              <p><strong>EPF (Employer 12%):</strong> LKR {salaryDetails.epfEmployer}</p>
              <p><strong>ETF (3%):</strong> LKR {salaryDetails.etfEmployer}</p>
              <p className="text-green-700 font-bold"><strong>Net Salary:</strong> LKR {salaryDetails.netSalary}</p>
            </div>
          )}

          <div className="col-span-2">
            <label className="block text-2xl">Status:</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateStatus("Available")}
                className={`w-1/2 p-2 rounded text-white ${status === "Available" ? "bg-green-600" : "bg-gray-400"}`}
              >
                Available
              </button>
              <button
                onClick={() => updateStatus("Not-Available")}
                className={`w-1/2 p-2 rounded text-white ${status === "Not-Available" ? "bg-red-600" : "bg-gray-400"}`}
              >
                Not Available
              </button>
            </div>
          </div>
        </div>

        {/* <JobCardListForMechnicProfile mechanicId={employee._id}/> */}
         
         
        <Routes> 
  <Route path="/" element={<JobCardListForMechnic2 mechanicId={employee._id} />} />
  <Route path="mechnic/:id" element={<JobCardUpdateMechnic2 />} />
</Routes>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/employeeProfile/leave", { state: employee })}
            className="p-2 w-1/3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Request Leave
          </button>
          <button
            onClick={() => navigate("/login")}
            className="p-2 w-1/3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
