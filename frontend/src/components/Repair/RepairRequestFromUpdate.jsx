import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateRepairRequest = () => {
  const { id } = useParams(); // Get the repair request ID from the URL
  const navigate = useNavigate(); // For navigation after update
  const [repairRequest, setRepairRequest] = useState({
    customerNameR: "",
    contactNumberR: "",
    emailR: "",
    addressR: "",
    vehicleRegiNumberR: "",
    vehicleMakeR: "",
    vehicleModelR: "",
    yearOfManufactureR: "",
    mileageR: "",
    vehicleIdentiNumberR: "",
    serviceTypeR: "",
    descripIssueR: "",
    prefDateAndTimeR: "",
    urgencyLevelR: "",
    paymentMethodR: "",
    vehiclePhotoR: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch the repair request data by ID
  useEffect(() => {
    const fetchRepairRequest = async () => {
      try {
        const token = localStorage.getItem("token");//RY
        const response = await axios.get(`http://localhost:5000/api/repairRequest/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })//RY
        console.log("API Response:", response.data); // Debugging: Check the response
        setRepairRequest(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repair request:", error);
        console.error("API Error Response:", error.response?.data); // Debugging: Check the error response
        toast.error("Failed to fetch repair request data.");
        setLoading(false);
      }
    };

    fetchRepairRequest();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRepairRequest({ ...repairRequest, [name]: value });
  };

  // Handle file input change (for vehicle photo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRepairRequest({
          ...repairRequest,
          vehiclePhotoR: {
            data: reader.result,
            contentType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/repairRequest/${id}`,
  //       repairRequest
  //     );
  //     if (response.status === 200) {
  //       toast.success("Repair request updated successfully!");
  //       navigate("/repairRequest"); // Redirect to the repair request list
  //     }
  //   } catch (error) {
  //     console.error("Error updating repair request:", error);
  //     toast.error("Failed to update repair request.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      toast.error("Invalid repair request ID.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        navigate("/");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/repairRequest/${id}`,
        repairRequest,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Repair request updated successfully!");
        navigate("/RepairadminDash/RepairReqList");
      }
    } catch (error) {
      console.error("Error updating repair request:", error);
  
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Failed to update repair request."}`);
      } else if (error.request) {
        toast.error("Network error: Unable to reach the server. Check CORS and server status.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4" style={{ 
      textAlign: "left",
      backgroundColor: "#D3D3D3",
      border: "1px solid black",  // Correct format
      padding: "20px",
      borderRadius: "10px",
      fontSize:"18px",
      margin:"5px",
      }}>
      <h2>Update Repair Request</h2>
      <form onSubmit={handleSubmit}>
        {/* Customer Details */}
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                className="form-control"
                name="customerNameR"
                value={repairRequest.customerNameR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                className="form-control"
                name="contactNumberR"
                value={repairRequest.contactNumberR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="emailR"
                value={repairRequest.emailR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                name="addressR"
                value={repairRequest.addressR}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Vehicle Registration Number</label>
              <input
                type="text"
                className="form-control"
                name="vehicleRegiNumberR"
                value={repairRequest.vehicleRegiNumberR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Vehicle Make</label>
              <input
                type="text"
                className="form-control"
                name="vehicleMakeR"
                value={repairRequest.vehicleMakeR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Vehicle Model</label>
              <input
                type="text"
                className="form-control"
                name="vehicleModelR"
                value={repairRequest.vehicleModelR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Year of Manufacture</label>
              <input
                type="number"
                className="form-control"
                name="yearOfManufactureR"
                value={repairRequest.yearOfManufactureR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Mileage</label>
              <input
                type="number"
                className="form-control"
                name="mileageR"
                value={repairRequest.mileageR}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Vehicle Identification Number (VIN)</label>
              <input
                type="text"
                className="form-control"
                name="vehicleIdentiNumberR"
                value={repairRequest.vehicleIdentiNumberR}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Repair Details */}
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Service Type</label>
              <input
                type="text"
                className="form-control"
                name="serviceTypeR"
                value={repairRequest.serviceTypeR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Description of Issue</label>
              <input
                type="text"
                className="form-control"
                name="descripIssueR"
                value={repairRequest.descripIssueR}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Preferred Date and Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="prefDateAndTimeR"
                value={
                  repairRequest.prefDateAndTimeR
                    ? new Date(repairRequest.prefDateAndTimeR).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Urgency Level</label>
              <select
                className="form-control"
                name="urgencyLevelR"
                value={repairRequest.urgencyLevelR}
                onChange={handleInputChange}
                required
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-control"
                name="paymentMethodR"
                value={repairRequest.paymentMethodR}
                onChange={handleInputChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Vehicle Photo</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Update Repair Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRepairRequest;