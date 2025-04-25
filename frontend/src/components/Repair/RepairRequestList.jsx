import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination, Form, FormControl, Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";//for notifycation
import "react-toastify/dist/ReactToastify.css";//for notifycation
import Swal from "sweetalert2";//for alert delete
import jsPDF from "jspdf";//dowunload pdf
import html2canvas from "html2canvas";//dowunload pdf
import "./RepairRequestList.css";

const RepairRequestList = () => {
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRepairRequests = async () => {
      try {
        const token = localStorage.getItem("token");//RY
        const response = await axios.get("http://localhost:5000/repairRequest/", {//RT
          headers: { Authorization: `Bearer ${token}` }
        })//RY
        setRepairRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRepairRequests();
  }, []);
  
  //convert binary
  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = "";
    let bytes = new Uint8Array(arrayBuffer || []);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Search logic
  const filteredRequests = repairRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.customerNameR.toLowerCase().includes(searchLower) ||
      request.vehicleRegiNumberR.toLowerCase().includes(searchLower) ||
      request.serviceTypeR.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count repair requests by service type
  const serviceTypeCounts = repairRequests.reduce((acc, request) => {
    acc[request.serviceTypeR] = (acc[request.serviceTypeR] || 0) + 1;
    return acc;
  }, {});

   // Count repair requests by vehicle make
   const vehicleMakeCounts = repairRequests.reduce((acc, request) => {
    acc[request.vehicleMakeR] = (acc[request.vehicleMakeR] || 0) + 1;
    return acc;
  }, {});

  // Count repair requests by urgency level
  const urgencyLevelCounts = repairRequests.reduce((acc, request) => {
    acc[request.urgencyLevelR] = (acc[request.urgencyLevelR] || 0) + 1;
    return acc;
  }, {});

    const handleDelete = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/repairRequest/${id}`)
            .then((res) => {
              setRepairRequests(repairRequests.filter((request) => request._id !== id));
              toast.success("Repair request deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
            })
            .catch((err) => {
              console.error(err);
              toast.error("Failed to delete repair request!", {
                position: "top-right",
                autoClose: 3000,
              });
            });
        } else {
          toast.warning("Deletion canceled!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    };

      // Function to download PDF
  const downloadPDF = () => {
    const input = document.getElementById("repair-requests-table"); // Target the table element
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size page
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("repair-requests.pdf"); // Save the PDF
    });
  };
  
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  return (
    <div className="coniner mt-4">
      <ToastContainer />
      <h1 className="text-center mb-4" style={{ textAlign: "center", fontSize: "2.5rem", color: "#333", marginBottom: "1.5rem" }}>
  Repair Requests
</h1>

     {/* Download PDF Button */}
     <div className="text-end mb-3">
        <Button variant="success" onClick={downloadPDF}>
          <i className="bi bi-download"></i> Download PDF
        </Button>
      </div>

      <div className="addd-end mb-3">
        <Link to={`/RepairadminDash/RepairReqFrom`} className="btn btn-primary btn-sm ms-2" style={{backgroundColor:"rgb(16, 33, 161)"}}>
        Add Repair Request
        </Link>
      </div>


      {/* Display Counts */}
      <div className="mb-4">
        <div className="row">
          <div className="col-md-4" 
              >
            <div style={{
                backgroundColor: "#D3D3D3",
                border: "1px solid black",  
                padding: "20px",
                borderRadius: "10px",
                fontSize:"18px",
                margin:"10px"
              }}>
                <p><strong>Total Repair Requests:</strong>
                <br></br> {repairRequests.length}</p>
            </div>
             
            <div  style={{
                  backgroundColor: "#EA6A47",
                  // color:"white",
                  border: "1px solid black", 
                  padding: "20px",
                  borderRadius: "10px",
                  fontSize:"18px",
                  margin:"10px"
                }}>
                  <p><strong>Repair Requests by Urgency Level:</strong></p>
                  <ul>
                    {Object.entries(urgencyLevelCounts).map(([urgency, count]) => (
                      <li key={urgency} style={{ textAlign: "left" }}>
                        <strong>{urgency}</strong>: {count} requests
                      </li>
                    ))}
                  </ul>
            </div>
             
          </div>
          <div className="col-md-4" style={{
                backgroundColor: "#488A99",
                border: "1px solid black",
                padding: "20px",
                borderRadius: "10px",
                fontSize: "18px",
                margin:"10px",
                width:"30%"
              }}>
            <p><strong>Repair Requests by Vehicle Make:</strong></p>
            <ul>
              {Object.entries(vehicleMakeCounts).map(([make, count]) => (
                <li key={make} style={{ textAlign: "left" }}>
                  <strong>{make}</strong>: {count} requests
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4"  style={{
                backgroundColor: "#DBAE58",
                border: "1px solid black",  
                padding: "20px",
                borderRadius: "10px",
                fontSize:"18px",
                margin:"10px",
                width:"33%"
              }}>
             <p><strong>Repair Requests by Service Type:</strong></p>
            <ul>
              {Object.entries(serviceTypeCounts).map(([serviceType, count]) => (
                <li key={serviceType} style={{textAlign: "left"}}>
                  <strong>{serviceType}</strong>: {count} requests
                </li>
              ))}
            </ul>
          </div>
        </div>
       
        
      </div>


      {/* Search Bar */}
      <Form className="mb-4">
        <FormControl
          type="text"
          placeholder="Search by Customer Name, Reg. No, or Service Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: "1200px", overflowY: "auto", textAlign: "left" }}>
        <Table   id="repair-requests-table" striped bordered hover className="table-sm" style={{ width: "1200px" }}>
          <thead className="sticky-top bg-light">
            <tr>
              <th>No</th>
              <th>Vehicle Photo</th>
              <th>Customer Details</th>
              <th>Vehicle Details</th>
              <th>Repair Details</th>
              <th>Service Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request, index) => (
              <tr key={request._id}>
                {/* No */}
                <td>{indexOfFirstRequest + index + 1}</td>

                {/* Vehicle Photo */}
                <td>
                  <img
                    src={
                      request.vehiclePhotoR?.data?.data
                        ? `data:${request.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
                          request.vehiclePhotoR.data.data
                          )}`
                        : "https://via.placeholder.com/300x200"
                    }
                    alt={request.vehicleMakeR || "vehicle"}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                </td>

                {/* Customer Details */}
                <td>
                  <div><strong>Name:</strong> {request.customerNameR || "N/A"}</div>
                  <div><strong>Contact:</strong> {request.contactNumberR || "N/A"}</div>
                  <div><strong>Email:</strong> {request.emailR || "N/A"}</div>
                  <div><strong>Address:</strong> {request.addressR || "N/A"}</div>
                </td>

                {/* Vehicle Details */}
                <td>
                  <div><strong>Reg. No:</strong> {request.vehicleRegiNumberR || "N/A"}</div>
                  <div><strong>Make:</strong> {request.vehicleMakeR || "N/A"}</div>
                  <div><strong>Model:</strong> {request.vehicleModelR || "N/A"}</div>
                  <div><strong>Year:</strong> {request.yearOfManufactureR || "N/A"}</div>
                  <div><strong>Mileage:</strong> {request.mileageR || "N/A"}</div>
                  <div><strong>VIN:</strong> {request.vehicleIdentiNumberR || "N/A"}</div>
                </td>

                {/* Repair Details */}
                <td>
                  <div><strong>Description:</strong> {request.descripIssueR || "N/A"}</div>
                  <div><strong>Preferred Date:</strong> {request.prefDateAndTimeR ? new Date(request.prefDateAndTimeR).toLocaleString() : "N/A"}</div>
                  <div><strong>Urgency:</strong> {request.urgencyLevelR || "N/A"}</div>
                  <div><strong>Payment:</strong> {request.paymentMethodR || "N/A"}</div>
                </td>

                {/* Service Type */}
                <td>{request.serviceTypeR || "N/A"}</td>

                {/* Action */}
                <td>
                {/* Update Button */}
                <Link to={`/RepairadminDash/repair-requests/${request._id}`} className="btn btn-success btn-sm me-2">
                  <i className="bi bi-pencil-fill"></i> Update
                </Link>

                {/* Delete Button */}
                <button className="btn btn-dark btn-sm" onClick={() => handleDelete(request._id)} style={{width:"80px",marginTop:"5px"}}>
                  <i className="bi bi-trash3-fill"></i> Delete
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
            disabled={currentPage === 1}
          />
          {[...Array(Math.ceil(filteredRequests.length / requestsPerPage)).keys()].map(
            (number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(filteredRequests.length / requestsPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage === Math.ceil(filteredRequests.length / requestsPerPage)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default RepairRequestList;