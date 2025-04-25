import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LeaveDetails() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set default status to "Pending" if not set
      const updatedLeaves = res.data.map((leave) => ({
        ...leave,
        status: leave.status || "Pending",
      }));
      setLeaveRequests(updatedLeaves);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("Failed to load leave requests");
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      // API endpoint for approval/rejection
      const endpoint =
        newStatus === "Approved"
          ? `http://localhost:5000/api/leave/approve/${id}`
          : `http://localhost:5000/api/leave/reject/${id}`;

      await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI
      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );

      toast.success(`Leave ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to update leave status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Leave Details</h2>
      {leaveRequests.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">Leave ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="border-b">
                <td className="p-3">{leave.id}</td>
                <td className="p-3">{leave.name}</td>
                <td className="p-3">{leave.email}</td>
                <td className="p-3">{leave.startDate}</td>
                <td className="p-3">{leave.endDate}</td>
                <td className="p-3">{leave.reason}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      leave.status === "Approved"
                        ? "bg-green-500"
                        : leave.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                    disabled={leave.status === "Approved"}
                    onClick={() => updateLeaveStatus(leave.id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded disabled:opacity-50"
                    disabled={leave.status === "Rejected"}
                    onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600 mt-4">No leave requests found.</p>
      )}
    </div>
  );
}
