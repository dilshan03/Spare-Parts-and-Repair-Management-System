// import React, { useState, useEffect } from "react";
// // import axiosInstance from "../../utils/axios";
// import axiosInstance from "../../utils/axios";

// import { useParams, useNavigate } from "react-router-dom";
// import { Button, Form, Spinner } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./JobCardCreate.css";

// const JobCardCreate = () => {
//   const { repairId } = useParams(); // Get repairId from URL
//   const navigate = useNavigate(); // For navigation
//   const [loading, setLoading] = useState(false);
//   const [mechanicsLoading, setMechanicsLoading] = useState(false); // Loading state for mechanics fetch
//   const [mechanics, setMechanics] = useState([]); // State to store mechanics
//   const [assignedMechanic, setAssignedMechanic] = useState(""); // State for assigned mechanic
//   const [jobs, setJobs] = useState([
//     { jobName: "", jobDescription: "", jobStatus: "Pending", jobCost: 0 },
//   ]);

//   // Fetch mechanics from the backend
//   useEffect(() => {
//     const fetchMechanics = async () => {
//       setMechanicsLoading(true);
//       try {
//         const response = await axiosInstance.get("/api/employees");
//         // Filter employees to include mechanics and painters
//         const mechanicsList = (response.data.data || []).filter(employee => 
//           employee.role === "Mechanic" || employee.role === "Painter"
//         );
//         setMechanics(mechanicsList);
//         console.log("Mechanics data:", mechanicsList);
//       } catch (error) {
//         console.error("Error fetching mechanics:", error);
//         toast.error("Failed to fetch mechanics!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } finally {
//         setMechanicsLoading(false);
//       }
//     };

//     fetchMechanics();
//   }, []);

//   // Handle job input change
//   const handleJobChange = (index, field, value) => {
//     const updatedJobs = [...jobs];
//     updatedJobs[index][field] = value;
//     setJobs(updatedJobs);
//   };

//   // Add a new job
//   const addJob = () => {
//     setJobs([...jobs, { jobName: "", jobDescription: "", jobStatus: "Pending", jobCost: 0 }]);
//   };

//   // Remove a job
//   const removeJob = (index) => {
//     const updatedJobs = jobs.filter((_, i) => i !== index);
//     setJobs(updatedJobs);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Log the request payload for debugging
//     console.log("Request Payload:", {
//       repairId,
//       assignedMechanic,
//       jobs,
//     });

//     try {
//       const response = await axiosInstance.post("/api/jobCards", {
//         repairId,
//         assignedMechanic,
//         jobs,
//       });

//       toast.success("Job Card created successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });

//       navigate("/"); // Navigate back to the main page
//     } catch (error) {
//       console.error("Error creating job card:", error);
//       toast.error("Failed to create job card!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h1>Create Job Card for Repair:</h1>
//       <Form onSubmit={handleSubmit}>
//         {/* Assigned Mechanic Dropdown */}
//         <Form.Group className="mb-3" style={{ maxWidth: "600px" }}>
//           <Form.Label>Assigned Mechanic</Form.Label>
//           <Form.Control
//             as="select"
//             value={assignedMechanic}
//             onChange={(e) => setAssignedMechanic(e.target.value)}
//             required
//           >
//             <option value="">Select a mechanic</option>
//             {mechanicsLoading ? (
//               <option disabled>Loading mechanics...</option>
//             ) : (
//               mechanics.map((mechanic) => (
//                 <option key={mechanic._id} value={mechanic._id}>
//                   {mechanic.firstName} {mechanic.lastName}
//                 </option>
//               ))
//             )}
//           </Form.Control>
//         </Form.Group>

//         {/* Job List - Now Horizontal */}
//         <div style={{ 
//           display: 'flex', 
//           flexWrap: 'wrap', 
//           gap: '20px',
//           marginBottom: '20px'
//         }}>
//           {jobs.map((job, index) => (
//             <div 
//               key={index} 
//               style={{
//                 flex: '0 1 350px',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '8px',
//                 padding: '15px',
//                 backgroundColor: '#fff'
//               }}
//             >
//               <h4>Job #{index + 1}</h4>
//               <Form.Group className="mb-3">
//                 <Form.Label>Job Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter job name"
//                   value={job.jobName}
//                   onChange={(e) => handleJobChange(index, "jobName", e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Job Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   placeholder="Enter job description"
//                   value={job.jobDescription}
//                   onChange={(e) => handleJobChange(index, "jobDescription", e.target.value)}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Job Cost</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter job cost"
//                   value={job.jobCost}
//                   onChange={(e) => handleJobChange(index, "jobCost", e.target.value)}
//                   required
//                 />
//               </Form.Group>
//               <Button 
//                 variant="danger" 
//                 onClick={() => removeJob(index)}
//                 size="sm"
//               >
//                 Remove Job
//               </Button>
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <div className="d-flex gap-2">
//           <Button variant="primary" onClick={addJob}>
//             Add Job
//           </Button>
//           <Button variant="success" type="submit" disabled={loading}>
//             {loading ? <Spinner size="sm" /> : "Create Job Card"}
//           </Button>
//         </div>
//       </Form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default JobCardCreate;




import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JobCardCreate.css";

const JobCardCreate = () => {
  const { repairId } = useParams(); // Get repairId from URL
  const navigate = useNavigate(); // For navigation
  const [loading, setLoading] = useState(false);
  const [mechanicsLoading, setMechanicsLoading] = useState(false); // Loading state for mechanics fetch
  const [mechanics, setMechanics] = useState([]); // State to store mechanics
  const [assignedMechanic, setAssignedMechanic] = useState(""); // State for assigned mechanic
  const [jobs, setJobs] = useState([
    { jobName: "", jobDescription: "", jobStatus: "Pending", jobCost: 0 },
  ]);

  // Fetch mechanics from the backend
  useEffect(() => {
    const fetchMechanics = async () => {
      setMechanicsLoading(true);
      try {
        const response = await axiosInstance.get("/api/employees/");
        // Filter employees to include mechanics and painters
        const mechanicsList = (response.data.data || []).filter(employee => 
          employee.role === "Mechanic" || employee.role === "Painter"
        );
        setMechanics(mechanicsList);
        console.log("Mechanics data:", mechanicsList);
      } catch (error) {
        console.error("Error fetching mechanics:", error);
        toast.error("Failed to fetch mechanics!", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setMechanicsLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  // Handle job input change
  const handleJobChange = (index, field, value) => {
    const updatedJobs = [...jobs];
    updatedJobs[index][field] = value;
    setJobs(updatedJobs);
  };

  // Add a new job
  const addJob = () => {
    setJobs([...jobs, { jobName: "", jobDescription: "", jobStatus: "Pending", jobCost: 0 }]);
  };

  // Remove a job
  const removeJob = (index) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log the request payload for debugging
    console.log("Request Payload:", {
      repairId,
      assignedMechanic,
      jobs,
    });

    try {
      const response = await axiosInstance.post("/api/jobCards", {
        repairId,
        assignedMechanic,
        jobs,
      });

      toast.success("Job Card created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/"); // Navigate back to the main page
    } catch (error) {
      console.error("Error creating job card:", error);
      toast.error("Failed to create job card!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Job Card for Repair:</h1>
      <Form onSubmit={handleSubmit}>
        {/* Assigned Mechanic Dropdown */}
        <Form.Group className="mb-3" style={{ maxWidth: "600px" }}>
          <Form.Label>Assigned Mechanic</Form.Label>
          <Form.Control
            as="select"
            value={assignedMechanic}
            onChange={(e) => setAssignedMechanic(e.target.value)}
            required
          >
            <option value="">Select a mechanic</option>
            {mechanicsLoading ? (
              <option disabled>Loading mechanics...</option>
            ) : (
              mechanics.map((mechanic) => (
                <option key={mechanic._id} value={mechanic._id}>
                  {mechanic.firstName} {mechanic.lastName}
                </option>
              ))
            )}
          </Form.Control>
        </Form.Group>

        {/* Job List - Now Horizontal */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          {jobs.map((job, index) => (
            <div 
              key={index} 
              style={{
                flex: '0 1 350px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fff'
              }}
            >
              <h4>Job #{index + 1}</h4>
              <Form.Group className="mb-3">
                <Form.Label>Job Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter job name"
                  value={job.jobName}
                  onChange={(e) => handleJobChange(index, "jobName", e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Job Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter job description"
                  value={job.jobDescription}
                  onChange={(e) => handleJobChange(index, "jobDescription", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Job Cost</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter job cost"
                  value={job.jobCost}
                  onChange={(e) => handleJobChange(index, "jobCost", e.target.value)}
                  required
                />
              </Form.Group>
              <Button 
                variant="danger" 
                onClick={() => removeJob(index)}
                size="sm"
              >
                Remove Job
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={addJob}>
            Add Job
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Create Job Card"}
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default JobCardCreate;




