



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Table, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobCardList = () => {
  const [jobCards, setJobCards] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [repair, setRepair] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredJobCards, setFilteredJobCards] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    mechanic: ''
  });
  const navigate = useNavigate();

  // Fetch all job cards and repair requests
  // Filter job cards based on current filters
  useEffect(() => {
    let filtered = [...jobCards];
    
    if (filters.status) {
      filtered = filtered.filter(jobCard => 
        jobCard.jobs.some(job => job.jobStatus === filters.status)
      );
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(jobCard => 
        new Date(jobCard.createdAt) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(jobCard => 
        new Date(jobCard.createdAt) <= new Date(filters.endDate)
      );
    }
    // // 
    // if (filters.mechanic) {
    //   filtered = filtered.filter(jobCard => 
    //     jobCard.assignedMechanic.toLowerCase().includes(filters.mechanic.toLowerCase())
    //   );
    // }
    
    setFilteredJobCards(filtered);
  }, [jobCards, filters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // ✅ Get token from local storage
        const [jobCardsResponse, repairRequestsResponse, repairResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/jobCards/", {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token to headers
          }),
          axios.get("http://localhost:5000/api/repairRequest/", {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token to headers
          }),
          axios.get("http://localhost:5000/api/repairs/get-all-repairs/", {
            headers: { Authorization: `Bearer ${token}` } // ✅ Attach token to headers
          }),
        ]);
        
        console.log("Fetched Job Cards:", jobCardsResponse.data);
        console.log("Fetched Repair Requests:", repairRequestsResponse.data);
        console.log("Fetched Repairs:", repairResponse.data);
        
        setJobCards(jobCardsResponse.data);
        setRepairRequests(repairRequestsResponse.data);
        setRepair(repairResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data!", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigate to job card details
  const handleViewDetails = (jobCardId) => {
    navigate(`mechnic/${jobCardId}`);
  };

  // Find the corresponding repair request for a job card
  const findRepairRequest = (repairId) => {
    console.log(`Looking for repair request with ID: ${repairId}`);
    const foundRequest = repairRequests.find((request) => request._id === repairId) || {};
    console.log("Found repair request:", foundRequest);
    return foundRequest;
  };
  

  return (
    <div className="container mt-4">
      <h1>Job Cards</h1>
      
      {/* Filters */}
      <div className="filters mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <select 
              className="form-select" 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              placeholder="Start Date"
            />
          </div>
          
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              placeholder="End Date"
            />
          </div>
          
          {/* <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              value={filters.mechanic}
              onChange={(e) => setFilters({...filters, mechanic: e.target.value})}
              placeholder="Search by Mechanic"
            />
          </div> */}
        </div>
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : filteredJobCards.length === 0 ? (
        <p>No job cards found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th> 
              <th>Assigned Mechanic</th>
              <th>Jobs</th>
              <th>Created At</th>
              <th>Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobCards.map((jobCard, index) => {
              console.log(`Processing Job Card #${index + 1}:`, jobCard);
              console.log("Job Card repairId:", jobCard.repairId);
              
              const repairRequest = findRepairRequest(jobCard.repairId);
              console.log("Associated repair request:", repairRequest);
              
              // Log the date in different formats
              const createdAt = new Date(jobCard.createdAt);
              console.log("Job Card created at (raw):", jobCard.createdAt);
              console.log("Job Card created at (Date object):", createdAt);
              console.log("Job Card created at (local string):", createdAt.toLocaleString());
              
              return (
                <tr key={jobCard._id} style={{ textAlign: "left"}}>
                  <td>{index + 1}</td>
                  <td>
                    {jobCard.assignedMechanic
                      ? `${jobCard.assignedMechanic.firstName} ${jobCard.assignedMechanic.lastName}`
                      : "N/A"}
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {jobCard.jobs.map((job, i) => (
                        <li key={i} className="mb-1">
                          <strong>{job.jobName}</strong><br />
                          Status:{" "}
                          <span
                            className={`badge bg-${job.jobStatus === "Completed" ? "success" : "warning"}`}
                          >
                            {job.jobStatus}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{new Date(jobCard.createdAt).toLocaleString()}</td>
                  <td>
                    {/* <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(jobCard._id)}
                    >
                      View Details
                    </Button> */}
                    
                     {jobCard.repairId?.requestFormId?.vehicleMakeR || "N/A"} {jobCard.repairId?.requestFormId?.vehicleModelR || "N/A"}<br></br>
                     {jobCard.repairId?.requestFormId?.vehicleIdentiNumberR || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <ToastContainer />
    </div>
  );
};

export default JobCardList;