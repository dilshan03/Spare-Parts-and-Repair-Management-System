
// // export default App;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import { Table, Pagination, Form, FormControl, Button, Spinner, Image } from "react-bootstrap";
// import Swal from 'sweetalert2'; // for notification
// import { ToastContainer, toast } from "react-toastify"; // for notification

// const App = () => {
//   const [repairRequestForms, setRepairRequestForms] = useState([]); // State to store all RepairRequestForms
//   const [repairs, setRepairs] = useState([]); // State to store all Repairs
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const [rowsPerPage] = useState(5); // Number of rows per page
//   const [loading, setLoading] = useState(false); // State for loading spinner

//   // Hardcoded backend URL
//   const backendUrl = "http://localhost:5000";

//   // Fetch all RepairRequestForms and Repairs on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [formsResponse, repairsResponse] = await Promise.all([
//         axios.get(`${backendUrl}/repairRequest/`),
//         axios.get(`${backendUrl}/repairs/`),
//       ]);
//       setRepairRequestForms(formsResponse.data);
//       setRepairs(repairsResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create repairs for all RepairRequestForms
//   const createRepairsForAllRequestForms = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/repairs/create-from-all-request-forms`);
//       console.log("Repairs created:", response.data);
//       fetchData(); // Refresh the list of repairs
//     } catch (error) {
//       console.error("Error creating repairs:", error);
//     }
//   };

//   // Combine repairRequestForms and repairs data
//   const combinedData = repairRequestForms.map((form, index) => {
//     const repair = repairs.find((repair) => repair.requestFormId === form._id);
//     return {
//       id: index + 1, // Add a number column
//       ...form,
//       repairId: repair ? repair._id : null, // Add repair ID to the combined data
//       repairCompleteStatus: repair ? repair.repairCompleteStatus : "Pending",
//       completedAt: repair ? repair.completedAt : null,
//       createdAt: repair ? repair.createdAt : null,
//       paymentStatus: repair ? repair.paymentStatus : "Pending",
//     };
//   });

//   //convert binary
//   const arrayBufferToBase64 = (arrayBuffer) => {
//     let binary = "";
//     let bytes = new Uint8Array(arrayBuffer || []);
//     for (let i = 0; i < bytes.length; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   };

//   // Filter data based on search query
//   const filteredData = combinedData.filter((data) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       data.customerNameR.toLowerCase().includes(searchLower) || // Search by Name
//       data.vehicleIdentiNumberR.toLowerCase().includes(searchLower) || // Search by VIN
//       data.repairCompleteStatus.toLowerCase().includes(searchLower) // Search by Status
//     );
//   });

//   // Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     // Format date
//     const formatDate = (date) => {
//       if (!date) return "-";
//       const parsedDate = new Date(date);
//       return isNaN(parsedDate) ? "-" : parsedDate.toLocaleString();
//     };
  

//   // Handle Open action
//   const handleOpen = (id) => {
//     console.log("Open repair request with ID:", id);
//     // Add your logic to handle the "Open" action
//   };

//   // Handle Delete action
//   const handleDelete = (id) => {
//     console.log("Delete repair with ID:", id);
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${backendUrl}/repairs/${id}`)
//           .then((res) => {
//             setRepairs(repairs.filter((data) => data._id !== id));
//             toast.success("Repair deleted successfully!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           })
//           .catch((err) => {
//             console.error(err);
//             toast.error("Failed to delete repair!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           });
//       } else {
//         toast.warning("Deletion canceled!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     });
//   };


//   return (
//     <div className="container mt-4" >
//       <h1 className="text-center mb-4">Repair Management System</h1>

//       {/* Button to create repairs for all RepairRequestForms */}
//       <div className="mb-4">
//         <h2>Create Repairs for All Request Forms</h2>
//         <Button variant="primary" onClick={createRepairsForAllRequestForms}>
//           Create Repairs for All Forms
//         </Button>
//       </div>

//       {/* Search Bar */}
//       <Form className="mb-4">
//         <FormControl
//           type="text"
//           placeholder="Search by Name, VIN, or Status..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </Form>

//       {/* Display combined data in a table */}
//       <h2>All Repairs</h2>
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>#</th> {/* Number column */}
//                 <th>Name, Vehicle & VIN</th> {/* Combined column */}
//                 <th>Vehicle Photo</th>
//                 <th>Service Type</th>
//                 <th>Repair Status</th>
//                 <th>Created At</th>
//                 <th>Completed At</th>
//                 <th>Payment Status</th>
//                 <th>Action</th> {/* Action column */}
//               </tr>
//             </thead>
//             <tbody style={{textAlign: "left" }}>
//               {currentRows.map((data) => (
//                 <tr key={data._id}>
//                   <td>{data.id}</td> {/* Number column */}
//                   <td>
//                     <strong>Name:</strong> {data.customerNameR} <br />
//                     <strong>Vehicle:</strong> {data.vehicleMakeR} {data.vehicleModelR} <br />
//                     <strong>VIN:</strong> {data.vehicleIdentiNumberR || "N/A"}
//                   </td>
//                   <td>
//                     {data.vehiclePhotoR ? (
//                       <Image
//                         src={
//                           data.vehiclePhotoR?.data?.data
//                             ? `data:${data.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
//                               data.vehiclePhotoR.data.data
//                               )}`
//                             : "https://via.placeholder.com/300x200"
//                         }
//                         alt={data.vehicleMakeR || "vehicle"}
//                         style={{ width: "100%", height: "100px", objectFit: "cover" }}
//                       />
//                     ) : (
//                       "No Photo"
//                     )}
//                   </td>
//                   <td>{data.serviceTypeR}</td>
//                   <td>{data.repairCompleteStatus}</td>
//                   <td>{formatDate(data.createdAt)}</td> {/* Format date */}
//                   <td>{formatDate(data.completedAt)}</td> {/* Format date */}
//                   <td>{data.paymentStatus}</td>
//                   <td>
//                     <Button variant="info" onClick={() => handleOpen(data._id)} className="me-2">
//                       Open
//                     </Button>
//                     <Button variant="danger" onClick={() => handleDelete(data._id)} 
//                     // disabled={!data.repairId} 
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Pagination Controls */}
//           <div className="d-flex justify-content-center">
//             <Pagination>
//               <Pagination.Prev
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//               />
//               {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((number) => (
//                 <Pagination.Item
//                   key={number + 1}
//                   active={number + 1 === currentPage}
//                   onClick={() => paginate(number + 1)}
//                 >
//                   {number + 1}
//                 </Pagination.Item>
//               ))}
//               <Pagination.Next
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
//               />
//             </Pagination>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import { Table, Pagination, Form, FormControl, Button, Spinner, Image } from "react-bootstrap";
// import Swal from 'sweetalert2'; // for notification
// import { ToastContainer, toast } from "react-toastify"; // for notification
// import { useNavigate } from "react-router-dom"; // For navigation

// const App = () => {
//   const [repairRequestForms, setRepairRequestForms] = useState([]); // State to store all RepairRequestForms
//   const [repairs, setRepairs] = useState([]); // State to store all Repairs
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const [rowsPerPage] = useState(5); // Number of rows per page
//   const [loading, setLoading] = useState(false); // State for loading spinner
//   const navigate = useNavigate(); // For navigation

//   // Hardcoded backend URL
//   const backendUrl = "http://localhost:5000";

//   // Fetch all RepairRequestForms and Repairs on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [formsResponse, repairsResponse] = await Promise.all([
//         axios.get(`${backendUrl}/repairRequest/`),
//         axios.get(`${backendUrl}/repairs/`),
//       ]);
//       setRepairRequestForms(formsResponse.data);
//       setRepairs(repairsResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create repairs for all RepairRequestForms
//   const createRepairsForAllRequestForms = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/repairs/create-from-all-request-forms`);
//       console.log("Repairs created:", response.data);
//       fetchData(); // Refresh the list of repairs
//     } catch (error) {
//       console.error("Error creating repairs:", error);
//     }
//   };

//   // Combine repairRequestForms and repairs data
//   const combinedData = repairRequestForms.map((form, index) => {
//     const repair = repairs.find((repair) => repair.requestFormId === form._id);
//     return {
//       id: index + 1, // Add a number column
//       ...form,
//       repairId: repair ? repair._id : null, // Add repair ID to the combined data
//       repairCompleteStatus: repair ? repair.repairCompleteStatus : "Pending",
//       completedAt: repair ? repair.completedAt : null,
//       createdAt: repair ? repair.createdAt : null,
//       paymentStatus: repair ? repair.paymentStatus : "Pending",
//     };
//   });

//   // Convert binary image data to base64
//   const arrayBufferToBase64 = (arrayBuffer) => {
//     let binary = "";
//     let bytes = new Uint8Array(arrayBuffer || []);
//     for (let i = 0; i < bytes.length; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   };

//   // Filter data based on search query
//   const filteredData = combinedData.filter((data) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       data.customerNameR.toLowerCase().includes(searchLower) || // Search by Name
//       data.vehicleIdentiNumberR.toLowerCase().includes(searchLower) || // Search by VIN
//       data.repairCompleteStatus.toLowerCase().includes(searchLower) // Search by Status
//     );
//   });

//   // Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "-";
//     const parsedDate = new Date(date);
//     return isNaN(parsedDate) ? "-" : parsedDate.toLocaleString();
//   };

//   // Handle Open action
//   const handleOpen = (repairId) => {
//     console.log("Open repair request with ID:", repairId);
//     navigate(`/jobcard-create/${repairId}`); // Navigate to JobCardCreate page with repairId
//   };

//   // Handle Delete action
//   const handleDelete = (id) => {
//     console.log("Delete repair with ID:", id);
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${backendUrl}/repairs/${id}`)
//           .then((res) => {
//             setRepairs(repairs.filter((data) => data._id !== id));
//             toast.success("Repair deleted successfully!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           })
//           .catch((err) => {
//             console.error(err);
//             toast.error("Failed to delete repair!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           });
//       }
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center mb-4">Repair Management System</h1>

//       {/* Button to create repairs for all RepairRequestForms */}
//       <div className="mb-4">
//         <h2>Create Repairs for All Request Forms</h2>
//         <Button variant="primary" onClick={createRepairsForAllRequestForms}>
//           Create Repairs for All Forms
//         </Button>
//       </div>

//       {/* Search Bar */}
//       <Form className="mb-4">
//         <FormControl
//           type="text"
//           placeholder="Search by Name, VIN, or Status..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </Form>

//       {/* Display combined data in a table */}
//       <h2>All Repairs</h2>
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>#</th> {/* Number column */}
//                 <th>Name, Vehicle & VIN</th> {/* Combined column */}
//                 <th>Vehicle Photo</th>
//                 <th>Service Type</th>
//                 <th>Repair Status</th>
//                 <th>Created At</th>
//                 <th>Completed At</th>
//                 <th>Payment Status</th>
//                 <th>Action</th> {/* Action column */}
//               </tr>
//             </thead>
//             <tbody>
//               {currentRows.map((data) => (
//                 <tr key={data._id}>
//                   <td>{data.id}</td> {/* Number column */}
//                   <td>
//                     <strong>Name:</strong> {data.customerNameR} <br />
//                     <strong>Vehicle:</strong> {data.vehicleMakeR} {data.vehicleModelR} <br />
//                     <strong>VIN:</strong> {data.vehicleIdentiNumberR || "N/A"}
//                   </td>
//                   <td>
//                     {data.vehiclePhotoR ? (
//                       <Image
//                         src={
//                           data.vehiclePhotoR?.data?.data
//                             ? `data:${data.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
//                               data.vehiclePhotoR.data.data
//                               )}`
//                             : "https://via.placeholder.com/300x200"
//                         }
//                         alt={data.vehicleMakeR || "vehicle"}
//                         style={{ width: "100%", height: "100px", objectFit: "cover" }}
//                       />
//                     ) : (
//                       "No Photo"
//                     )}
//                   </td>
//                   <td>{data.serviceTypeR}</td>
//                   <td>{data.repairCompleteStatus}</td>
//                   <td>{formatDate(data.createdAt)}</td> {/* Format date */}
//                   <td>{formatDate(data.completedAt)}</td> {/* Format date */}
//                   <td>{data.paymentStatus}</td>
//                   <td>
//                     <Button variant="info" onClick={() => handleOpen(data.repairId)} className="me-2">
//                       Open
//                     </Button>
//                     <Button variant="danger" onClick={() => handleDelete(data._id)}>
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Pagination Controls */}
//           <div className="d-flex justify-content-center">
//             <Pagination>
//               <Pagination.Prev
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//               />
//               {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((number) => (
//                 <Pagination.Item
//                   key={number + 1}
//                   active={number + 1 === currentPage}
//                   onClick={() => paginate(number + 1)}
//                 >
//                   {number + 1}
//                 </Pagination.Item>
//               ))}
//               <Pagination.Next
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
//               />
//             </Pagination>
//           </div>
//         </>
//       )}

//       {/* Toast Container for Notifications */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default App;
///122222222000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import { Table, Pagination, Form, FormControl, Button, Spinner, Image } from "react-bootstrap";
// import Swal from 'sweetalert2'; // For notifications
// import { ToastContainer, toast } from "react-toastify"; // For toast notifications
// import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
// import { useNavigate } from "react-router-dom"; // For navigation
// import JobCardCreate from "./JobCardCreate"; // Import JobCardCreate component

// const App = () => {
//   const [repairRequestForms, setRepairRequestForms] = useState([]); // State to store all RepairRequestForms
//   const [repairs, setRepairs] = useState([]); // State to store all Repairs
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [currentPage, setCurrentPage] = useState(1); // State for current page
//   const [rowsPerPage] = useState(5); // Number of rows per page
//   const [loading, setLoading] = useState(false); // State for loading spinner
//   const navigate = useNavigate(); // For navigation

//   // Hardcoded backend URL
//   const backendUrl = "http://localhost:5000";

//   // Fetch all RepairRequestForms and Repairs on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [formsResponse, repairsResponse] = await Promise.all([
//         axios.get(`${backendUrl}/repairRequest/`),
//         axios.get(`${backendUrl}/repairs/`),
//       ]);
//       setRepairRequestForms(formsResponse.data);
//       setRepairs(repairsResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create repairs for all RepairRequestForms
//   const createRepairsForAllRequestForms = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/repairs/create-from-all-request-forms`);
//       console.log("Repairs created:", response.data);
//       fetchData(); // Refresh the list of repairs
//     } catch (error) {
//       console.error("Error creating repairs:", error);
//     }
//   };

//   // Combine repairRequestForms and repairs data
//   const combinedData = repairRequestForms.map((form, index) => {
//     const repair = repairs.find((repair) => repair.requestFormId === form._id);
//     return {
//       id: index + 1, // Add a number column
//       ...form,
//       repairId: repair ? repair._id : null, // Add repair ID to the combined data
//       repairCompleteStatus: repair ? repair.repairCompleteStatus : "Pending",
//       completedAt: repair ? repair.completedAt : null,
//       createdAt: repair ? repair.createdAt : null,
//       paymentStatus: repair ? repair.paymentStatus : "Pending",
//     };
//   });

//   // Convert binary image data to base64
//   const arrayBufferToBase64 = (arrayBuffer) => {
//     let binary = "";
//     let bytes = new Uint8Array(arrayBuffer || []);
//     for (let i = 0; i < bytes.length; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   };

//   // Filter data based on search query
//   const filteredData = combinedData.filter((data) => {
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       data.customerNameR.toLowerCase().includes(searchLower) || // Search by Name
//       data.vehicleIdentiNumberR.toLowerCase().includes(searchLower) || // Search by VIN
//       data.repairCompleteStatus.toLowerCase().includes(searchLower) // Search by Status
//     );
//   });

//   // Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "-";
//     const parsedDate = new Date(date);
//     return isNaN(parsedDate) ? "-" : parsedDate.toLocaleString();
//   };

//   // Handle Open action
//   const handleOpen = (repairId) => {
//     console.log("Open repair request with ID:", repairId);
//     navigate(`/jobcard-create/${repairId}`); // Navigate to JobCardCreate page with repairId
//   };

//   // Handle Delete action
//   const handleDelete = (id) => {
//     console.log("Delete repair with ID:", id);
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`${backendUrl}/repairs/${id}`)
//           .then((res) => {
//             setRepairs(repairs.filter((data) => data._id !== id));
//             toast.success("Repair deleted successfully!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           })
//           .catch((err) => {
//             console.error(err);
//             toast.error("Failed to delete repair!", {
//               position: "top-right",
//               autoClose: 3000,
//             });
//           });
//       }
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center mb-4">Repair Management System</h1>

//       {/* Button to create repairs for all RepairRequestForms */}
//       <div className="mb-4">
//         <h2>Create Repairs for All Request Forms</h2>
//         <Button variant="primary" onClick={createRepairsForAllRequestForms}>
//           Create Repairs for All Forms
//         </Button>
//       </div>

//       {/* Search Bar */}
//       <Form className="mb-4">
//         <FormControl
//           type="text"
//           placeholder="Search by Name, VIN, or Status..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </Form>

//       {/* Display combined data in a table */}
//       <h2>All Repairs</h2>
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//         </div>
//       ) : (
//         <>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>#</th> {/* Number column */}
//                 <th>Name, Vehicle & VIN</th> {/* Combined column */}
//                 <th>Vehicle Photo</th>
//                 <th>Service Type</th>
//                 <th>Repair Status</th>
//                 <th>Created At</th>
//                 <th>Completed At</th>
//                 <th>Payment Status</th>
//                 <th>Action</th> {/* Action column */}
//               </tr>
//             </thead>
//             <tbody>
//               {currentRows.map((data) => (
//                 <tr key={data._id}>
//                   <td>{data.id}</td> {/* Number column */}
//                   <td>
//                     <strong>Name:</strong> {data.customerNameR} <br />
//                     <strong>Vehicle:</strong> {data.vehicleMakeR} {data.vehicleModelR} <br />
//                     <strong>VIN:</strong> {data.vehicleIdentiNumberR || "N/A"}
//                   </td>
//                   <td>
//                     {data.vehiclePhotoR ? (
//                       <Image
//                         src={
//                           data.vehiclePhotoR?.data?.data
//                             ? `data:${data.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
//                               data.vehiclePhotoR.data.data
//                               )}`
//                             : "https://via.placeholder.com/300x200"
//                         }
//                         alt={data.vehicleMakeR || "vehicle"}
//                         style={{ width: "100%", height: "100px", objectFit: "cover" }}
//                       />
//                     ) : (
//                       "No Photo"
//                     )}
//                   </td>
//                   <td>{data.serviceTypeR}</td>
//                   <td>{data.repairCompleteStatus}</td>
//                   <td>{formatDate(data.createdAt)}</td> {/* Format date */}
//                   <td>{formatDate(data.completedAt)}</td> {/* Format date */}
//                   <td>{data.paymentStatus}</td>
//                   <td>
//                     <Button variant="info" onClick={() => handleOpen(data.repairId)} className="me-2">
//                       Open
//                     </Button>
//                     <Button variant="danger" onClick={() => handleDelete(data._id)}>
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Pagination Controls */}
//           <div className="d-flex justify-content-center">
//             <Pagination>
//               <Pagination.Prev
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//               />
//               {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((number) => (
//                 <Pagination.Item
//                   key={number + 1}
//                   active={number + 1 === currentPage}
//                   onClick={() => paginate(number + 1)}
//                 >
//                   {number + 1}
//                 </Pagination.Item>
//               ))}
//               <Pagination.Next
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
//               />
//             </Pagination>
//           </div>
//         </>
//       )}

//       {/* Toast Container for Notifications */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default App;import React, { useState, useEffect } from "react";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination, Form, FormControl, Button, Spinner, Image } from "react-bootstrap";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import JobCardCreate from "./JobCardCreate";

const App = () => {
  const [repairRequestForms, setRepairRequestForms] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [formsResponse, repairsResponse] = await Promise.all([
        axios.get(`${backendUrl}/repairRequest/`),
        axios.get(`${backendUrl}/repairs/`),
      ]);
      console.log("Repair Request Forms:QQQQQQQQQQQQQQQQQQQQQQQ", formsResponse.data);
      console.log("Repairs:RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", repairsResponse.data);
      setRepairRequestForms(formsResponse.data);
      setRepairs(repairsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRepairsForAllRequestForms = async () => {
    try {
      const response = await axios.post(`${backendUrl}/repairs/create-from-all-request-forms`);
      console.log("Repairs created:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error creating repairs:", error);
    }
  };

//     const combinedData = repairRequestForms.map((form, index) => {
//     // Convert form._id to string for comparison
//     const formId = form._id.toString();

//     // Find the matching repair for the current form
//     const repair = repairs.find((repair) => {
//       console.log("Repair ID:", repair._id)

//         if (repair?.requestFormId?.toString() === formId) {
//             return true;
//         } else {
//             console.log(`No match for ${formId}:`, repair);
//             return false;
//         }
//     }) || {}; // Default to an empty object if no match is found
//     console.log("Repair ID2222222222:", repair._id)
//     // Log matching repair for debugging
//     console.log(`Matching Repair for RequestForm ${form._id}:`, repair);

//     // Return combined data with appropriate fallback values
//     return {
//         id: index + 1,
//         ...form, // Assuming form is already a plain object
//         repairId: repair?._id , // If repair exists, assign its _id, otherwise null
//         repairCompleteStatus: repair?.repairCompleteStatus || "Pending", // Default to 'Pending'
//         completedAt: repair?.completedAt || null, // Default to null if not present
//         createdAt: repair?.createdAt || null, // Default to null if not present
//         paymentStatus: repair?.paymentStatus || "Pending", // Default to 'Pending'
//     };
// });

const combinedData = repairRequestForms.map((form, index) => {
  // Convert form._id to string for comparison
  const formId = form._id.toString();

  // Find the matching repair for the current form
  const repair = repairs.find((repair) => {
      console.log("Repair ID11111:", repair?._id); // Use optional chaining to avoid errors

      if (repair?.requestFormId?.toString() === formId) {
          return true;
      } else {
          console.log(`No match for ${formId}:`, repair);
          return false;
      }
  }); // No default empty object here, as we want to handle undefined explicitly

  // Log matching repair for debugging
  console.log(`Matching Repair for RequestForm ${form._id}:`, repair);

  // Return combined data with appropriate fallback values
  return {
      id: index + 1,
      ...form, // Assuming form is already a plain object
      repairId: repair?._id || null, // Use optional chaining and fallback to null
      repairCompleteStatus: repair?.repairCompleteStatus || "Pending", // Default to 'Pending'
      completedAt: repair?.completedAt || null, // Default to null if not present
      createdAt: repair?.createdAt || null, // Default to null if not present
      paymentStatus: repair?.paymentStatus || "Pendkkkkkkkkkking", // Default to 'Pending'
  };
});
  console.log("Combined Data:", combinedData);

  // const combinedData = repairRequestForms.map((form, index) => {
  //   const repair = repairs.find((repair) => repair.requestFormId === form._id);
  //   if (!repair) {
  //     console.warn(`No repair found for form ID: ${form._id}`,repair);
  //   }
  //   return {
  //     id: index + 1,
  //     ...form,
  //     repairId: repair?repair._id : null,
  //     repairCompleteStatus:repair?repair.repairCompleteStatus : "Pending",
  //     completedAt: repair?repair.completedAt : null,
  //     createdAt: repair?repair.createdAt : null,
  //     paymentStatus: repair?repair.paymentStatus : "Pending",
  //   };
  // });

  // const combinedData = repairRequestForms.map((form, index) => {
  //   const repair = repairs.find((repair) => repair.requestFormId === form._id);
    
  //   console.log(`Matching Repair for RequestForm ${form._id}:`, repair);
  
  //   return {
  //     id: index + 1,
  //     ...form,
  //     repairId: repair?._id || null,  // Ensure repairId is assigned correctly
  //     repairCompleteStatus: repair?.repairCompleteStatus || "Pending",
  //     completedAt: repair?.completedAt || null,
  //     createdAt: repair?.createdAt || null,
  //     paymentStatus: repair?.paymentStatus || "Pending",
  //   };
  // });

  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = "";
    let bytes = new Uint8Array(arrayBuffer || []);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const filteredData = combinedData.filter((data) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      data.customerNameR.toLowerCase().includes(searchLower) ||
      data.vehicleIdentiNumberR.toLowerCase().includes(searchLower) ||
      data.repairCompleteStatus.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "-" : parsedDate.toLocaleString();
  };

  const handleOpen = (repairId) => {
    console.log("Open repair request with ID:DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", repairId);
    if (!repairId) {
      toast.error("No repair ID found for this request form!");
      return;
    }
    console.log("Open repair request with ID:", repairId);
    navigate(`/jobcard-create/${repairId}`);
  };

  const handleDelete = (id) => {
    console.log("Delete repair with ID:", id);
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
          .delete(`${backendUrl}/repairs/${id}`)
          .then((res) => {
            setRepairs(repairs.filter((data) => data._id !== id));
            toast.success("Repair deleted successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to delete repair!", {
              position: "top-right",
              autoClose: 3000,
            });
          });
      }
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Repair Management System</h1>

      <div className="mb-4">
        <h2>Create Repairs for All Request Forms</h2>
        <Button variant="primary" onClick={createRepairsForAllRequestForms}>
          Create Repairs for All Forms
        </Button>
      </div>

      <Form className="mb-4">
        <FormControl
          type="text"
          placeholder="Search by Name, VIN, or Status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      <h2>All Repairs</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name, Vehicle & VIN</th>
                <th>Vehicle Photo</th>
                <th>Service Type</th>
                <th>Repair Status</th>
                <th>Created At</th>
                <th>Completed At</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((data) => (
                  <tr key={data._id}>
                    <td>{data.id}</td>
                    <td>
                      <strong>Name:</strong> {data.customerNameR} <br />
                      <strong>Vehicle:</strong> {data.vehicleMakeR} {data.vehicleModelR} <br />
                      <strong>VIN:</strong> {data.vehicleIdentiNumberR || "N/A"}
                    </td>
                    <td>
                      {data.vehiclePhotoR ? (
                        <Image
                          src={
                            data.vehiclePhotoR?.data?.data
                              ? `data:${data.vehiclePhotoR.contentType};base64,${arrayBufferToBase64(
                                  data.vehiclePhotoR.data.data
                                )}`
                              : "https://via.placeholder.com/300x200"
                          }
                          alt={data.vehicleMakeR || "vehicle"}
                          style={{ width: "100%", height: "100px", objectFit: "cover" }}
                        />
                      ) : (
                        "No Photo"
                      )}
                    </td>
                    <td>{data.serviceTypeR}</td>
                    <td>{data.repairCompleteStatus}</td>
                    <td>{formatDate(data.createdAt)}</td>
                    <td>{formatDate(data.completedAt)}</td>
                    <td>{data.paymentStatus} {data.repairId}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleOpen(data.repairId)}
                        className="me-2"
                        // disabled={!data.repairId}
                      >
                        Open
                      </Button>

                      {/* <Button
                      repairs.find((repair) =>{
                        variant="info"
                        onClick={() => handleOpen(repairId_id)}
                        className="me-2"
                        // disabled={!data.repairId}
                      }
                      >
                        Open
                      </Button> */}
                      <Button
  variant="info"
  className="me-2"
  onClick={() => {
    const repair = repairs.find((repair) => repair.RepairID); 
    if (repair) handleOpen(repair.RepairID);
  }}
>
  Open
</Button>


                      
                      <Button variant="danger" onClick={() => handleDelete(data._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
              />
            </Pagination>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;