// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Button, Table, Spinner } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const JobCardList = () => {
//   const [jobCards, setJobCards] = useState([]);
//   const [repairRequests, setRepairRequests] = useState([]); // State for repair requests
//   const [repair, setRepair] = useState([]); // new
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch all job cards and repair requests
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [jobCardsResponse, repairRequestsResponse,repairResponse] = await Promise.all([
//           axios.get("http://localhost:5000/jobCards/"),
//           axios.get("http://localhost:5000/repairRequest/"),
//           axios.get("http://localhost:5000/repairs/get-all-repairs/"),//new
//         ]);
//         setJobCards(jobCardsResponse.data);
//         setRepairRequests(repairRequestsResponse.data);
//         setRepair(repairResponse.data);//new
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to fetch data!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Navigate to job card details
//   const handleViewDetails = (jobCardId) => {
//     navigate(`/jobCards/${jobCardId}`);
//   };

//   // Find the corresponding repair request for a job card
//   const findRepairRequest = (repairId) => {
//     return repairRequests.find((request) => request._id === repairId) || {};
//   };
  

//   return (
//     <div className="container mt-4">
//       <h1>Job Cards</h1>
//       {loading ? (
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       ) : jobCards.length === 0 ? (
//         <p>No job cards found.</p>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Customer Details</th>
//               <th>Vehicle Details</th>
//               <th>Assigned Mechanic</th>
//               <th>Jobs</th>
//               <th>Created At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobCards.map((jobCard, index) => {
//               const repairRequest = findRepairRequest(jobCard.repairId); // Find the matching repair request
//               return (
//                 <tr key={jobCard._id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <div>
//                     {/* {jobCard.repairID.requestFormID?.vehicleMakeR ?? "N/A"} */}
//                       <strong>Name:</strong> {repairRequest.customerNameR || "N/A"}<br />
//                       <strong>Contact:</strong> {repairRequest.contactNumberR || "N/A"}<br />
//                       <strong>Email:</strong> {repairRequest.emailR || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     <div>
//                       <strong>Make:</strong> {repairRequest.vehicleMakeR || "N/A"}<br />
//                       <strong>Model:</strong> {repairRequest.vehicleModelR || "N/A"}<br />
//                       <strong>Reg No:</strong> {repairRequest.vehicleRegiNumberR || "N/A"}<br />
//                       <strong>VIN:</strong> {repairRequest.vehicleIdentiNumberR || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     {jobCard.assignedMechanic
//                       ? `${jobCard.assignedMechanic.firstName} ${jobCard.assignedMechanic.lastName}`
//                       : "N/A"}
//                   </td>
//                   <td>
//                     <ul className="list-unstyled mb-0">
//                       {jobCard.jobs.map((job, i) => (
//                         <li key={i} className="mb-1">
//                           <strong>{job.jobName}</strong><br />
//                           Status:{" "}
//                           <span
//                             className={`badge bg-${job.jobStatus === "Completed" ? "success" : "warning"}`}
//                           >
//                             {job.jobStatus}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td>{new Date(jobCard.createdAt).toLocaleString()}</td>
//                   <td>
//                     <Button
//                       variant="info"
//                       size="sm"
//                       onClick={() => handleViewDetails(jobCard._id)}
//                     >
//                       View Details
//                     </Button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default JobCardList;








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
  const navigate = useNavigate();

  // Fetch all job cards and repair requests
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
          })
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
    navigate(`/RepairadminDash/jobCards/${jobCardId}`);
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
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : jobCards.length === 0 ? (
        <p>No job cards found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Details</th>
              <th>Vehicle Details</th>
              <th>Assigned Mechanic</th>
              <th>Jobs</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((jobCard, index) => {
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
                    <div> 
                      <strong>Name:</strong>{jobCard.repairId.requestFormId?.customerNameR ?? "N/A"}<br />
                      <strong>Contact:</strong> {jobCard.repairId.requestFormId?.contactNumberR ?? "N/A"}<br />
                      <strong>Email:</strong> {jobCard.repairId.requestFormId?.emailR ?? "N/A"} 
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>Make:</strong> {jobCard.repairId.requestFormId?.vehicleMakeR ?? "N/A"}<br />
                      <strong>Model:</strong> {jobCard.repairId.requestFormId?.vehicleModelR ?? "N/A"}<br />
                      <strong>Reg No:</strong> {jobCard.repairId.requestFormId?.vehicleRegiNumberR ?? "N/A"}<br />
                      <strong>VIN:</strong> {jobCard.repairId.requestFormId?.vehicleIdentiNumberR ?? "N/A"}
                    </div>
                  </td>
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
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(jobCard._id)}
                    >
                      View Details
                    </Button>
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