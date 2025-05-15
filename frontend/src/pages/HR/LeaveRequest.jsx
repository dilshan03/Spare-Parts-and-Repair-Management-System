import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate , useLocation } from "react-router-dom";


export default function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state;

  

  // Fetch leave requests for logged-in user
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in and try again");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveRequests(response.data);
      } catch (error) {
        toast.error("Failed to fetch leave requests");
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle leave request submission
  const submitLeaveRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in and try again");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/leave",
        { startDate, endDate, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      // Optionally refresh the leave requests after submission
      setLeaveRequests((prevRequests) =>
        Array.isArray(prevRequests)
          ? [...prevRequests, response.data.leave]
          : [response.data.leave]
      );
    } catch (error) {
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-lightblue">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[800px] border border-gray-300">
        <h1 className="text-4xl font-bold text-center mb-4 uppercase">Leave Requests</h1>

        {/* Display existing leave requests */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Your Leave Requests:</h2>
          {leaveRequests.length > 0 ? (
            <ul>
              {leaveRequests.map((leave) => (
                <li key={leave._id} className="mb-4 p-4 border border-gray-300 rounded">
                  <p><strong>Start Date:</strong> {leave.startDate}</p>
                  <p><strong>End Date:</strong> {leave.endDate}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Status:</strong> {leave.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No leave requests found.</p>
          )}
        </div>

        {/* Leave request form */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Request New Leave</h2>
          <input
            type="date"
            className="w-full p-2 mb-4 border rounded text-black"
            value={startDate}
            min={new Date().toISOString().split("T")[0]} // can't pick past
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && new Date(e.target.value) >= new Date(endDate)) {
                setEndDate(""); // clear if invalid
              }
            }}
          />
          <input
            type="date"
            className="w-full p-2 mb-4 border rounded text-black"
            value={endDate}
            min={
              startDate
                ? new Date(new Date(startDate).getTime() + 86400000) // +1 day in ms
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            onChange={(e) => setEndDate(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-4 border rounded"
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            onClick={submitLeaveRequest}
            className="w-full m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Leave Request
          </button>

          <button
            onClick={() => navigate("/employeeProfile/" , { state: employee } )}
            className="p-2 m-2 w-full bg-green-500 text-white rounded hover:bg-green-600"
          >
            Back to profile
          </button>
        </div>
      </div>
    </div>
  );
}
