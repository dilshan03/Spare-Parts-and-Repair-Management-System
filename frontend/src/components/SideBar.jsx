// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="bg-gray-900 text-white w-64 min-h-screen p-6 shadow-lg">
//       <h3 className="mb-6 text-xl font-bold">Admin Panel</h3>
//       <nav className="space-y-2">

//         <Link to="/finance-dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Finance Dashboard
//         </Link>

//         <Link to="/admin/employees/details" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Employee Dashboard
//         </Link>

//         <Link to="/QuotationDash/" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Quotation Dashboard
//         </Link>

//         <Link to="/RepairadminDash/RepairReqList" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Repair Job Requests
//         </Link>

//         <Link to="/ServiceDash" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Service Appointments Dashboard
//         </Link>
        
//         <Link to="/inventory-dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Inventory Dashboard
//         </Link>

//          <Link to="/importdash/" className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition">
//           Vehicle Import Dashboard
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = {
    display: "block",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    color: "white",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
    marginBottom: "0.5rem",
    ":hover": {
      backgroundColor: "#4b5563"
    }
  };

  return (
    <div style={{
      backgroundColor: "#111827",
      color: "white",
      width: "16rem",
      minHeight: "100vh",
      padding: "1.5rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    }}>
      <h3 style={{
        marginBottom: "1.5rem",
        fontSize: "1.25rem",
        fontWeight: "700"
      }}>Admin Panel</h3>
      
      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>

        <Link 
          to="/finance-dashboard" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Finance Dashboard
        </Link>

        <Link 
          to="/admin/employees/details" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Employee Dashboard
        </Link>

        <Link 
          to="/QuotationDash/" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Quotation Dashboard
        </Link>

        <Link 
          to="/RepairadminDash/RepairReqList" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Repair Job Requests
        </Link>

        <Link 
          to="/ServiceDash" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Service Appointments Dashboard
        </Link>
        
        <Link 
          to="/inventory-dashboard" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Inventory Dashboard
        </Link>

        <Link 
          to="/import" 
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Vehicle Import Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;