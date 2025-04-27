import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const AdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/appointments");
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        showNotification("Failed to load appointments", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      const updatedList = appointments.filter(app => app._id !== id);
      setAppointments(updatedList);
      setFilteredAppointments(updatedList);
      showNotification("Appointment deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showNotification("Failed to delete appointment", "error");
    }
  };

  const handleSearch = () => {
    const results = appointments.filter(app => app.date === searchDate);
    setFilteredAppointments(results);
    showNotification(`Found ${results.length} appointments`, "info");
  };

  const handleResetSearch = () => {
    setSearchDate("");
    setFilteredAppointments(appointments);
  };

  const handleEditClick = (appointment) => {
    setEditingId(appointment._id);
    setEditData({
      serviceType: appointment.serviceType,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        editData
      );
      const updatedAppointments = appointments.map((app) =>
        app._id === id ? response.data : app
      );
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      setEditingId(null);
      setEditData({});
      showNotification("Appointment updated successfully", "success");
    } catch (error) {
      console.error("Error updating appointment:", error);
      showNotification("Failed to update appointment", "error");
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.get("http://localhost:5000/api/appointments/report",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const report = response.data;

      // Create PDF document
      const doc = new jsPDF();
      const lineHeight = 10;
      let y = 20;

      // Add title
      doc.setFontSize(16);
      doc.text('Service Requests Report', 20, y);
      y += lineHeight * 2;

      // Add generation time and total appointments
      doc.setFontSize(12);
      doc.text(`Generated at: ${new Date(report.generatedAt).toLocaleString()}`, 20, y);
      y += lineHeight;
      doc.text(`Total Appointments: ${report.totalAppointments}`, 20, y);
      y += lineHeight * 2;

      // Add appointments
      doc.setFontSize(12);
      report.appointments.forEach(app => {
        // Check if we need a new page
        if (y > 270) { // Leave margin at bottom
          doc.addPage();
          y = 20;
        }

        doc.setFont(undefined, 'bold');
        doc.text('Customer Details:', 20, y);
        y += lineHeight;

        doc.setFont(undefined, 'normal');
        doc.text(`Name: ${app.name}`, 30, y);
        y += lineHeight;
        doc.text(`Email: ${app.email}`, 30, y);
        y += lineHeight;
        doc.text(`Service Type: ${app.serviceType}`, 30, y);
        y += lineHeight;
        doc.text(`Date: ${new Date(app.date).toLocaleDateString()}`, 30, y);
        y += lineHeight;
        doc.text(`Time: ${app.timeSlot}`, 30, y);
        y += lineHeight;
        if (app.status) {
          doc.text(`Status: ${app.status}`, 30, y);
          y += lineHeight;
        }
        y += lineHeight; // Add space between appointments
      });

      // Save the PDF
      doc.save(`service-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      showNotification("Report generated successfully", "success");
    } catch (error) {
      console.error("Error generating report:", error);
      showNotification("Failed to generate report", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg text-white ${
            notification.type === "error"
              ? "bg-red-500"
              : notification.type === "success"
              ? "bg-green-500"
              : "bg-blue-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointment Dashboard</h1>
            <p className="text-gray-600">
              Manage and track all customer appointments
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate Report
            </button>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {appointments.length} Total Appointments
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
                {searchDate && (
                  <button
                    onClick={handleResetSearch}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            {searchDate && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredAppointments.length}</span>{" "}
                  appointments for{" "}
                  <span className="font-medium">
                    {new Date(searchDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center p-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No appointments found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchDate
                  ? "Try a different date or reset the filter"
                  : "No appointments have been scheduled yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vehicle
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {appointment.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {appointment.vehicleNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === appointment._id ? (
                          <select
                            name="serviceType"
                            value={editData.serviceType}
                            onChange={handleChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="Vehicle Service">Vehicle Service</option>
                            <option value="Oil Change">Oil Change</option>
                            <option value="Brake Repair">Brake Repair</option>
                            <option value="Tire Rotation">Tire Rotation</option>
                            <option value="Battery Check">Battery Check</option>
                          </select>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {appointment.serviceType}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === appointment._id ? (
                          <div className="space-y-2">
                            <input
                              type="date"
                              name="date"
                              value={editData.date}
                              onChange={handleChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            />
                            <input
                              type="text"
                              name="timeSlot"
                              value={editData.timeSlot}
                              onChange={handleChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              placeholder="Time slot"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.timeSlot}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === appointment._id ? (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleSaveClick(appointment._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleEditClick(appointment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;