

 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Table, Spinner, Modal, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";

const App = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPayment, setEditPayment] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRepair, setViewRepair] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/repairs/get-all-repairs/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRepairs(response.data);
    } catch (error) {
      console.error("Error fetching repairs:", error);
      setError("Failed to fetch repairs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (repairId) => {
    if (!repairId) {
      toast.error("No repair ID found for this request form!");
      return;
    }
    navigate(`/RepairadminDash/jobcard-create/${repairId}`);
  };

  const handleSendEmail = async (repairId) => {
    try {
      const token = localStorage.getItem("token");
      toast.info("Sending email...");
      
      const response = await axios.post(`http://localhost:5000/repairs/send-email/${repairId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Email sent to customer successfully!");
    } catch (error) {
      console.error("Email error:", error);
      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data.message || "Failed to send email.");
      } else if (error.request) {
        // Request was made but no response
        toast.error("Server not responding. Please try again later.");
      } else {
        // Something else went wrong
        toast.error("Failed to send email. Please try again.");
      }
    }
  };

  const handleEditRepair = (repair) => {
    if (!repair) return;
    setSelectedRepair(repair);
    setEditStatus(repair.repairCompleteStatus);
    setEditPayment(repair.paymentStatus);
    setShowEditModal(true);
  };

  const handleViewRepair = (repair) => {
    setViewRepair(repair);
    setShowViewModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRepair) return;
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        repairCompleteStatus: editStatus,
        paymentStatus: editPayment
      };
      
      if (editStatus === "Completed") {
        updateData.completedAt = new Date().toISOString();
      } else if (selectedRepair.repairCompleteStatus === "Completed" && editStatus !== "Completed") {
        updateData.completedAt = null;
      }

      await axios.put(
        `http://localhost:5000/repairs/${selectedRepair._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success("Repair updated successfully!");
      setShowEditModal(false);
      setSelectedRepair(null);
      setEditStatus("");
      setEditPayment("");
      fetchRepairs(); // refresh list
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update repair.");
    }
  };

  const createRepairsForAllRequestForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/repairs/create-from-all-request-forms", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Repairs created:", response.data);
      toast.success("Repairs created successfully!");
      fetchRepairs();
    } catch (error) {
      console.error("Error creating repairs:", error);
      toast.error("Failed to create repairs. Please try again later.");
    }
  };

  const filteredRepairs = repairs.filter((repair) => {
    const customerName = repair.requestFormId?.customerNameR?.toLowerCase() || "";
    const vehicleNumber = repair.requestFormId?.vehicleIdentiNumberR?.toLowerCase() || "";
    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      vehicleNumber.includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRepairs = filteredRepairs.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search by customer name or vehicle number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

      <Button
        variant="primary"
        onClick={createRepairsForAllRequestForms}
        style={{ backgroundColor: "rgb(16, 33, 161)" }}
      >
        Create Repairs for All Request Forms
      </Button>

      {loading ? (
        <p>Loading repairs...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <RepairList
          repairs={currentRepairs}
          handleOpen={handleOpen}
          totalItems={filteredRepairs.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          paginate={paginate}
          handleSendEmail={handleSendEmail}
          handleEditRepair={handleEditRepair}
          handleViewRepair={handleViewRepair}
        />
      )}

      {/* Edit Repair Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Repair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Repair Status</Form.Label>
              <Form.Control
                as="select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={editPayment}
                onChange={(e) => setEditPayment(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const RepairList = ({
  repairs,
  handleOpen,
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
  handleSendEmail,
  handleEditRepair,
  handleViewRepair
}) => {
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRepair, setViewRepair] = useState(null);
  const handleViewDetails = (repair) => {
    if (repair.requestFormId?._id) {
      navigate(`/RepairadminDash/repair-requests/${repair.requestFormId._id}`);
    } else {
      toast.error("Request form not found for this repair");
    }
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleViewClick = (repair) => {
    setViewRepair(repair);
    setShowViewModal(true);
  };

  return (
    <div>
      <h2>Repair List</h2>
      {repairs.length === 0 ? (
        <p>No repairs found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Vehicle Details</th>
                <th>Repair Status</th>
                <th>Payment Status</th>
                <th>Created At</th>
                <th>Completed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair, index) => (
                <tr key={repair._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{repair.requestFormId?.customerNameR ?? "N/A"}<br/>
                  {repair.requestFormId?.contactNumberR ?? "N/A"}</td>
                  <td>
                    {repair.requestFormId?.vehicleMakeR ?? "N/A"}<br />
                    {repair.requestFormId?.vehicleIdentiNumberR ?? "N/A"}
                  </td>
                  <td>
                    <Badge
                      bg={
                        repair.repairCompleteStatus === "Completed"
                          ? "success"
                          : repair.repairCompleteStatus === "In Progress"
                          ? "primary"
                          : "warning"
                      }
                    >
                      {repair.repairCompleteStatus}
                    </Badge>
                  </td>
                  <td>{repair.paymentStatus}</td>
                  <td>{new Date(repair.createdAt).toLocaleString()}</td>
                  <td>
                    {repair.completedAt ? (
                      <span className="text-success">
                        {new Date(repair.completedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span className="text-muted">Not Completed</span>
                    )}
                  </td>
                  <td style={{ minWidth: '320px' }}>
                    <div className="d-flex gap-2">
                      <Button variant="success" size="sm" onClick={() => handleSendEmail(repair._id)}>Email</Button>
                      <Button variant="info" size="sm" onClick={() => handleViewClick(repair)}>View</Button>
                      <Button variant="warning" size="sm" onClick={() => handleEditRepair(repair)}>Edit</Button>
                      <Button variant="primary" size="sm" onClick={() => handleOpen(repair._id)}>Add Jobs</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === page && styles.activePaginationButton),
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton className="bg-gray-50 border-b">
          <Modal.Title className="text-xl font-semibold text-gray-800">Repair Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white p-6">
          {viewRepair && viewRepair.requestFormId && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="text-lg font-semibold text-blue-800 mb-3">Customer Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700"><span className="font-medium">Name:</span> {viewRepair.requestFormId.customerNameR}</p>
                  <p className="text-gray-700"><span className="font-medium">Contact:</span> {viewRepair.requestFormId.contactNumberR}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {viewRepair.requestFormId.emailR}</p>
                  <p className="text-gray-700"><span className="font-medium">Address:</span> {viewRepair.requestFormId.addressR}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="text-lg font-semibold text-green-800 mb-3">Vehicle Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700"><span className="font-medium">Registration Number:</span> {viewRepair.requestFormId.vehicleRegiNumberR}</p>
                  <p className="text-gray-700"><span className="font-medium">Make:</span> {viewRepair.requestFormId.vehicleMakeR}</p>
                  <p className="text-gray-700"><span className="font-medium">Model:</span> {viewRepair.requestFormId.vehicleModelR}</p>
                  <p className="text-gray-700"><span className="font-medium">Year:</span> {viewRepair.requestFormId.yearOfManufactureR}</p>
                  <p className="text-gray-700"><span className="font-medium">Mileage:</span> {viewRepair.requestFormId.mileageR}</p>
                  <p className="text-gray-700"><span className="font-medium">VIN:</span> {viewRepair.requestFormId.vehicleIdentiNumberR}</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="text-lg font-semibold text-purple-800 mb-3">Service Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700"><span className="font-medium">Service Type:</span> {viewRepair.requestFormId.serviceTypeR}</p>
                  <p className="text-gray-700"><span className="font-medium">Preferred Date:</span> {new Date(viewRepair.requestFormId.prefDateAndTimeR).toLocaleString()}</p>
                  <p className="text-gray-700"><span className="font-medium">Urgency Level:</span> {viewRepair.requestFormId.urgencyLevelR}</p>
                  <p className="text-gray-700"><span className="font-medium">Payment Method:</span> {viewRepair.requestFormId.paymentMethodR}</p>
                  <p className="text-gray-700 col-span-2"><span className="font-medium">Issue Description:</span> {viewRepair.requestFormId.descripIssueR}</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="text-lg font-semibold text-orange-800 mb-3">Repair Status</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700"><span className="font-medium">Repair Status:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${viewRepair.repairCompleteStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {viewRepair.repairCompleteStatus}
                    </span>
                  </p>
                  <p className="text-gray-700"><span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm ${viewRepair.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {viewRepair.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t bg-gray-50">
          <Button 
            variant="secondary" 
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  searchBar: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  createRepairsButton: {
    marginBottom: "20px",
    backgroundColor: "#28a745",
    border: "none",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  tr: {
    ":hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  button: {
    margin: "0 5px",
    padding: "5px 10px",
    backgroundColor: "#488A99",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
  paginationButton: {
    margin: "0 5px",
    padding: "5px 10px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activePaginationButton: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
};

// const styles = {
//   container: {
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//   },
//   searchBar: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "20px",
//     borderRadius: "4px",
//     border: "1px solid #ddd",
//   },
//   button: {
//     margin: "0 5px",
//     padding: "5px 10px",
//     backgroundColor: "#488A99",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   error: {
//     color: "red",
//     textAlign: "center",
//   },
//   pagination: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   paginationButton: {
//     margin: "0 5px",
//     padding: "5px 10px",
//     backgroundColor: "#f2f2f2",
//     border: "1px solid #ddd",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   activePaginationButton: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//   },
// };

export default App;

