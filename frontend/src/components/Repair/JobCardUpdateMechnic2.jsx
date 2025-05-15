import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Table, Spinner, Badge, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const JobCardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    jobName: "",
    jobDescription: "",
    jobStatus: "Pending",
    jobCost: 0
  });

 
  useEffect(() => {
    const fetchJobCard = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobCards/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobCard(response.data);
      } catch (error) {
        toast.error("Failed to fetch job card details");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobCard();
  }, [id]);
  
  // Convert binary
  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = "";
    let bytes = new Uint8Array(arrayBuffer || []);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  
  const handleJobUpdate = async (jobIndex, updatedJob) => {
    try {
      const token = localStorage.getItem("token");
      setUpdating(true);
      const updatedJobs = [...jobCard.jobs];
      updatedJobs[jobIndex] = updatedJob;
  
      const response = await axios.put(
        `http://localhost:5000/api/jobCards/${id}`,
        { jobs: updatedJobs },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      setJobCard(response.data);
      toast.success("Job updated successfully");
    } catch (error) {
      toast.error("Failed to update job");
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };
  

  
  const handleRemoveJob = async (jobIndex) => {
    try {
      const token = localStorage.getItem("token");
      setUpdating(true);
      const updatedJobs = jobCard.jobs.filter((_, index) => index !== jobIndex);
  
      const response = await axios.put(
        `http://localhost:5000/api/jobCards/${id}`,
        { jobs: updatedJobs },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      setJobCard(response.data);
      toast.success("Job removed successfully");
    } catch (error) {
      toast.error("Failed to remove job");
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading job card details...</p>
      </div>
    );
  }

  if (!jobCard) {
    return <div className="alert alert-danger mt-5">Job card not found</div>;
  }

  return (
    <div className="container mt-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        Back to List
      </Button>
      
      <h2>
        <strong>Job Card</strong> 
            
      </h2>
      
      <div className="card mb-4">
        <div className="card-header" style={{backgroundColor: "black", color: "white"}}>
          <h4>
          Vehicle {jobCard.repairId?.requestFormId?.vehicleIdentiNumberR || "N/A"} {jobCard.repairId?.requestFormId?.vehicleMakeR || "N/A"} {jobCard.repairId?.requestFormId?.vehicleModelR || "N/A"}
    
          </h4>
        </div>
        <div className="card-body">
          <dic className="row">
          <h5><strong>Assigned Mechanic:</strong> {jobCard.assignedMechanic?.firstName || "N/A"} {jobCard.assignedMechanic?.lastName || ""}</h5>
          <h5><strong>Created:</strong> {new Date(jobCard.createdAt).toLocaleString()}</h5>
          </dic>
          <div className="row" style={{ textAlign: "left",fontSize: "17px"}}>
            <div className="col-md-6" style={{  border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <div className=" " style={{ margin: "10px" ,marginTop: "25px"}}>
                <h5><strong>Vehicle</strong></h5>
                <p><strong>Registration number:</strong> {jobCard.repairId?.requestFormId?.vehicleRegiNumberR || "N/A"}<br></br>
                <strong>Make:</strong> {jobCard.repairId?.requestFormId?.vehicleMakeR || "N/A"}<br></br>
                <strong>Model:</strong> {jobCard.repairId?.requestFormId?.vehicleModelR || "N/A"}<br></br>
                <strong>Manufacture:</strong> {jobCard.repairId?.requestFormId?.yearOfManufactureR || "N/A"}<br></br>
                <strong>Mileage:</strong> {jobCard.repairId?.requestFormId?.mileageR || "N/A"}<br></br>
                <strong>VIN:</strong> {jobCard.repairId?.requestFormId?.vehicleIdentiNumberR || "N/A"}<br></br>
                </p> 
              </div>
              <div className=" " style={{ margin: "10px",marginTop: "25px"}}>
                <h5><strong>Customer</strong></h5>
                <p><strong>Name:</strong> {jobCard.repairId?.requestFormId?.customerNameR || "N/A"} <br></br>
                <strong>Contact:</strong> {jobCard.repairId?.requestFormId?.contactNumberR || "N/A"} <br></br>
                <strong>Email:</strong> {jobCard.repairId?.requestFormId?.emailR || "N/A"} <br></br>
                <strong>Addrees:</strong> {jobCard.repairId?.requestFormId?.addressR || "N/A"}</p>
              
              </div>
              

              
            </div>
            <div className="col-md-6"> 

              <div className="image-container" style={{ marginBottom: "10px" }}>
                <img
                      src={
                        jobCard.repairId?.requestFormId?.vehiclePhotoR?.data?.data
                          ? `data:${jobCard.repairId?.requestFormId?.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
                            jobCard.repairId?.requestFormId?.vehiclePhotoR.data.data
                            )}`
                          : "https://via.placeholder.com/300x200"
                      }
                      alt={jobCard.repairId?.requestFormId?.vehicleMakeR || "vehicle"}
                      style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
              </div>
              <div className="cRequirements" style={{  border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                <div style={{ margin: "10px" }}>
                <h5><strong>Customer requirment</strong></h5>
                <p><strong>Service Type:</strong> {jobCard.repairId?.requestFormId?.serviceTypeR || "N/A"} <br></br>
                <strong>Issue:</strong> {jobCard.repairId?.requestFormId?.descripIssueR || "N/A"} <br></br>
                <strong>Pref Date And Time:</strong> {jobCard.repairId?.requestFormId?.prefDateAndTimeR || "N/A"} <br></br>
                <strong>Urgency Level:</strong> {jobCard.repairId?.requestFormId?.urgencyLevelR || "N/A"} <br></br>
                <strong>Payment Method:</strong> {jobCard.repairId?.requestFormId?.paymentMethodR || "N/A"}</p>
                {jobCard.completedAt && <p><strong>Completed:</strong> {new Date(jobCard.completedAt).toLocaleString()}</p>}
              
                </div>
              </div>
              
            </div>
            

          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center" style={{backgroundColor: "black", color: "white"}}>
          <h4>My Jobs</h4>
        </div>
        <div className="card-body">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobCard.jobs.map((job, index) => (
                <JobRow 
                  key={index}
                  job={job}
                  index={index}
                  onUpdate={handleJobUpdate}
                  onRemove={handleRemoveJob}
                  updating={updating}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const JobRow = ({ job, index, onUpdate, onRemove, updating }) => {
  const [editing, setEditing] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });

  const handleSave = () => {
    onUpdate(index, editedJob);
    setEditing(false);
  };

  return (
    <tr>
      <td>
        {editedJob.jobName}
      </td>
      <td>
        {editedJob.jobDescription}
      </td>
      <td>
        {editing ? (
          <Form.Select
            value={editedJob.jobStatus}
            onChange={(e) => setEditedJob({...editedJob, jobStatus: e.target.value})}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        ) : (
          <Badge 
            bg={job.jobStatus === "Completed" ? "success" : 
                job.jobStatus === "In Progress" ? "primary" : "warning"}
            className="text-capitalize"
          >
            {job.jobStatus}
          </Badge>
        )}
      </td>
      <td>
        {editedJob.jobCost}
      </td>
      <td>
        <div className="d-flex gap-2">
          {editing ? (
            <>
              <Button variant="success" size="sm" onClick={handleSave} disabled={updating}>
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="info" size="sm" onClick={() => setEditing(true)}>
                Update
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default JobCardDetail;