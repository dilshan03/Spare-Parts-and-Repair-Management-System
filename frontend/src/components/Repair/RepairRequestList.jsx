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
import logo from "../../assets/logo.jpg";

const RepairRequestList = () => {
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

// Function to generate PDF report
const generatePDF = () => {
  try {
    // Use all repair requests for PDF
    const requestsToShow = repairRequests || [];
    console.log('Generating PDF with data:', requestsToShow);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15; // Reduced margin for more space
    let startY = margin; // Current Y position

    // Add logo
    const img = new Image();
    img.src = logo;
    const logoWidth = 30; // Width of the logo in mm
    const logoHeight = 30; // Height of the logo in mm
    const logoX = margin; // Position from left margin
    doc.addImage(img, 'JPEG', logoX, startY, logoWidth, logoHeight);
    
    // Add company header (moved to the right of the logo)
    doc.setFontSize(18); // Slightly smaller header
    doc.setFont('helvetica', 'bold');
    doc.text('Cosmo Exports Lanka (PVT) LTD', logoX + logoWidth + 10, startY + 15, { align: 'left' });
    startY += 20; // Increased spacing after company name
    
    doc.setFontSize(10); // Smaller contact info
    doc.setFont('helvetica', 'normal');
    doc.text('496/1, Naduhena, Meegoda, Sri Lanka', pageWidth / 2, startY, { align: 'center' });
    startY += 5;
    doc.text('Phone: +94 77 086 4011  +94 11 275 2373', pageWidth / 2, startY, { align: 'center' });
    startY += 5;
    doc.text('Email: cosmoexportslanka@gmail.com', pageWidth / 2, startY, { align: 'center' });
    startY += 12;
    
    // Add report title
    doc.setFontSize(14); // Smaller title
    doc.setFont('helvetica', 'bold');
    doc.text('Repair Requests Report', pageWidth / 2, startY, { align: 'center' });
    startY += 5;
    
    doc.setLineWidth(0.3); // Thinner line
    doc.line(margin, startY, pageWidth - margin, startY);
    startY += 8;
    
    // Table configuration - reduced column widths
    const headers = ['#', 'Customer', 'Vehicle', 'Repair', 'Status'];
    const colWidths = [8, 50, 50, 50, 12]; // Narrower columns, especially status
    const rowHeight = 7; // Smaller base row height
    const cellPadding = 2;
    const headerHeight = 8;
    
    // Draw table header with reduced height
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, startY, pageWidth - 2 * margin, headerHeight, 'F');
    
    doc.setFontSize(10); // Smaller header font
    doc.setFont('helvetica', 'bold');
    doc.setDrawColor(128, 128, 128);
    doc.setLineWidth(0.1); // Thinner borders
    
    // Draw header borders and text
    let currentX = margin;
    headers.forEach((header, i) => {
      // Make status header text smaller
      const fontSize = i === headers.length - 1 ? 8 : 10;
      doc.setFontSize(fontSize);
      
      doc.rect(currentX, startY, colWidths[i], headerHeight);
      doc.text(header, currentX + cellPadding, startY + cellPadding * 2);
      currentX += colWidths[i];
    });
    
    startY += headerHeight;
    
    // Table content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9); // Smaller content font
    
    requestsToShow.forEach((request, index) => {
      // Check if we need a new page (with higher threshold)
      if (startY > pageHeight - 40) {
        doc.addPage();
        startY = margin;
        // Redraw header if needed
      }
      
      // Prepare content with shorter labels
      const customerDetails = [
        `${request.customerNameR || '-'}`,
        `Tel: ${request.contactNumberR || '-'}`,
        `Email: ${request.emailR || '-'}`
        // Removed address to save space
      ];
      
      const vehicleDetails = [
        `${request.vehicleRegiNumberR || '-'}`,
        `${request.vehicleMakeR || '-'} ${request.vehicleModelR || ''}`,
        `Year: ${request.yearOfManufactureR || '-'}`,
        `Mileage: ${request.mileageR || '-'}`
        // Removed VIN to save space
      ];
      
      const repairDetails = [
        `${request.descripIssueR?.substring(0, 40) || '-'}...`,
        `Date: ${request.prefDateAndTimeR || '-'}`,
        `Urgency: ${request.urgencyLevelR || '-'}`
        // Removed payment method to save space
      ];
      
      const status = request.repairStatusR || '-';
      
      // Calculate max lines needed (reduced to 3 max)
      const maxLines = Math.min(
        Math.max(
          customerDetails.length,
          vehicleDetails.length,
          repairDetails.length,
          1
        ),
        3 // Limit to 3 lines max
      );
      
      const currentRowHeight = rowHeight * maxLines;
      
      // Draw row borders
      let currentX = margin;
      headers.forEach((_, i) => {
        doc.rect(currentX, startY, colWidths[i], currentRowHeight);
        currentX += colWidths[i];
      });
      
      // Add cell content
      currentX = margin;
      
      // Index cell
      doc.text(String(index + 1), currentX + cellPadding, startY + cellPadding * 2);
      currentX += colWidths[0];
      
      // Customer details cell
      customerDetails.slice(0, maxLines).forEach((line, i) => {
        doc.text(line, currentX + cellPadding, startY + cellPadding * 2 + (i * rowHeight));
      });
      currentX += colWidths[1];
      
      // Vehicle details cell
      vehicleDetails.slice(0, maxLines).forEach((line, i) => {
        doc.text(line, currentX + cellPadding, startY + cellPadding * 2 + (i * rowHeight));
      });
      currentX += colWidths[2];
      
      // Repair details cell
      repairDetails.slice(0, maxLines).forEach((line, i) => {
        doc.text(line, currentX + cellPadding, startY + cellPadding * 2 + (i * rowHeight));
      });
      currentX += colWidths[3];
      
      // Status cell - smaller font and centered
      doc.setFontSize(8);
      doc.text(status, currentX + colWidths[4]/2, startY + currentRowHeight/2, { align: 'center' });
      doc.setFontSize(9); // Reset font size
      
      startY += currentRowHeight;
    });
    
    // Add compact footer
    const pageCount = doc.internal.getNumberOfPages();
    const footerText = `Generated: ${new Date().toLocaleDateString()}`;
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8); // Smaller footer
      doc.text(
        `Page ${i}/${pageCount} | ${footerText}`,
        pageWidth / 2,
        pageHeight - 7,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save('repair_requests_report.pdf');
    toast.success('PDF report generated successfully!');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report');
  }
};
  // // Function to generate PDF report
  // const generatePDF = () => {
  //   // Use all repair requests for PDF
  //   const requestsToShow = repairRequests || [];
  //   console.log('Generating PDF with data:', requestsToShow);
  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.width;
    
  //   // Add company header
  //   doc.setFontSize(20);
  //   doc.text('Cosmo Exports Lanka (PVT) LTD', pageWidth / 2, 20, { align: 'center' });
    
  //   doc.setFontSize(12);
  //   doc.text('496/1, Naduhena, Meegoda, Sri Lanka', pageWidth / 2, 30, { align: 'center' });
  //   doc.text('Phone: +94 77 086 4011  +94 11 275 2373', pageWidth / 2, 35, { align: 'center' });
  //   doc.text('Email: cosmoexportslanka@gmail.com', pageWidth / 2, 40, { align: 'center' });
    
  //   // Add report title
  //   doc.setFontSize(16);
  //   doc.text('Repair Requests Report', pageWidth / 2, 55, { align: 'center' });
  //   doc.setLineWidth(0.5);
  //   doc.line(20, 58, pageWidth - 20, 58);
    
  //   // Table headers exactly as shown in table
  //   const headers = ['#', 'Customer Details', 'Vehicle Details', 'Repair Details', 'Status'];
  //   let startY = 70;
  //   const rowHeight = 50; // Increased for multiple lines
  //   const colWidths = [15, 60, 60, 60, 15]; // Match table column widths
  //   const cellPadding = 3; // Padding inside cells
  //   let currentX = 20; // Starting X position
    
  //   // Draw table borders
  //   doc.setDrawColor(128, 128, 128); // Gray border color
  //   doc.setLineWidth(0.5);
    
  //   // Draw outer table border
  //   doc.rect(20, startY - 8, pageWidth - 40, doc.internal.pageSize.height - startY - 20);
    
  //   // Draw header background
  //   doc.setFillColor(245, 245, 245); // Light gray background
  //   doc.rect(20, startY - 8, pageWidth - 40, 15, 'F');
    
  //   doc.setFontSize(12);
  //   doc.setFont('helvetica', 'bold');
    
  //   // Draw vertical lines for columns
  //   doc.setLineWidth(0.2);
  //   currentX = 20;
  //   headers.forEach((_, i) => {
  //     doc.line(currentX, startY - 8, currentX, doc.internal.pageSize.height - 30);
  //     currentX += colWidths[i];
  //   });
  //   doc.line(currentX, startY - 8, currentX, doc.internal.pageSize.height - 30);
    
  //   // Draw headers with proper spacing
  //   currentX = 20;
  //   headers.forEach((header, i) => {
  //     doc.text(header, currentX + cellPadding, startY);
  //     currentX += colWidths[i];
  //   });
    
  //   // Draw header line
  //   doc.setLineWidth(0.2);
  //   doc.line(20, startY + 4, pageWidth - 20, startY + 4);
    
  //   // Table content
  //   doc.setFont('helvetica', 'normal');
  //   requestsToShow.forEach((request, index) => {
  //     console.log('Processing request:', request);
  //     startY += rowHeight;
      
  //     // Add new page if content exceeds page height
  //     if (startY > 280) {
  //       doc.addPage();
  //       startY = 20;
  //     }
      
  //     // Format customer details exactly as shown in table
  //     const customerDetails = [
  //       `Name: ${request.customerNameR || '-'}`,
  //       `Contact: ${request.contactNumberR || '-'}`,
  //       `Email: ${request.emailR || '-'}`,
  //       `Address: ${request.addressR || '-'}`
  //     ].join('\n');

  //     // Format vehicle details exactly as shown in table
  //     const vehicleDetails = [
  //       `Reg. No: ${request.vehicleRegiNumberR || '-'}`,
  //       `Make: ${request.vehicleMakeR || '-'}`,
  //       `Model: ${request.vehicleModelR || '-'}`,
  //       `Year: ${request.yearOfManufactureR || '-'}`,
  //       `Mileage: ${request.mileageR || '-'}`,
  //       `VIN: ${request.vehicleIdentiNumberR || '-'}`
  //     ].join('\n');

  //     // Format repair details exactly as shown in table
  //     const repairDetails = [
  //       `Description: ${request.descripIssueR || '-'}`,
  //       `Preferred Date: ${request.prefDateAndTimeR || '-'}`,
  //       `Urgency: ${request.urgencyLevelR || '-'}`,
  //       `Payment: ${request.paymentMethodR || '-'}`
  //     ].join('\n');

  //     const status = request.repairStatusR || '-';
      
  //     // Draw horizontal line between rows
  //     doc.setLineWidth(0.2);
  //     doc.line(20, startY - 4, pageWidth - 20, startY - 4);
      
  //     // Reset X position for new row
  //     currentX = 20;
      
  //     // Draw vertical lines for row
  //     doc.setLineWidth(0.1);
  //     headers.forEach((_, i) => {
  //       doc.line(currentX, startY - 4, currentX, startY + rowHeight - 4);
  //       currentX += colWidths[i];
  //     });
  //     doc.line(currentX, startY - 4, currentX, startY + rowHeight - 4);
      
  //     currentX = 20;
  //     doc.setFontSize(9); // Smaller font for details
      
  //     // Draw each cell with proper width and padding
  //     doc.text(String(index + 1), currentX + cellPadding, startY);
      
  //     // Customer details cell
  //     doc.text(customerDetails, currentX + cellPadding, startY);
  //     currentX += colWidths[1];
      
  //     // Vehicle details cell
  //     doc.text(vehicleDetails, currentX + cellPadding, startY);
  //     currentX += colWidths[2];
      
  //     // Repair details cell
  //     doc.text(repairDetails, currentX + cellPadding, startY);
  //     currentX += colWidths[3];
      
  //     // Status cell
  //     doc.setFontSize(10);
  //     doc.text(status, currentX + cellPadding, startY);
      
  //     // Draw row line
  //     doc.setLineWidth(0.1);
  //     doc.line(20, startY + 2, pageWidth - 20, startY + 2);
  //   });
    
  //   // Add footer
  //   const pageCount = doc.internal.getNumberOfPages();
  //   for (let i = 1; i <= pageCount; i++) {
  //     doc.setPage(i);
  //     doc.setFontSize(10);
  //     doc.text(
  //       `Page ${i} of ${pageCount}`,
  //       pageWidth / 2,
  //       doc.internal.pageSize.height - 10,
  //       { align: 'center' }
  //     );
  //     doc.text(
  //       `Generated on ${new Date().toLocaleString()}`,
  //       20,
  //       doc.internal.pageSize.height - 10
  //     );
  //   }
    
  //   // Save the PDF
  //   doc.save('repair_requests_report.pdf');
  //   toast.success('PDF report generated successfully!');
  // };

  useEffect(() => {
    const fetchRepairRequests = async () => {
      try {
        const token = localStorage.getItem("token");//RY
        const response = await axios.get("http://localhost:5000/api/repairRequest/", {//RT
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
          const token = localStorage.getItem("token");//RY
          axios
            .delete(`http://localhost:5000/api/repairRequest/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
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
     {/* <div className="text-end mb-3">
        <Button variant="success" onClick={downloadPDF}>
          <i className="bi bi-download"></i> Download PDF
        </Button>
      </div> */}

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
                  {repairRequests.length}</p>
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <Form className="d-flex" style={{ width: "250px" }}>
            <FormControl
              type="search"
              placeholder="Search Name / Repair Type"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
          
          <Button 
            variant="success" 
            onClick={generatePDF}
            disabled={loading || repairRequests.length === 0}
          >
            <i className="fas fa-download me-2"></i>
            Download PDF
          </Button>
        </div>
      </div>

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