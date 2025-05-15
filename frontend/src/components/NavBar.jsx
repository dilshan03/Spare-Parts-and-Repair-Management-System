// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
//       <h2 className="text-2xl font-bold text-orange-500">COSMO EXPORTS</h2>
//       <ul className="flex space-x-6">
//         <li>
//           <Link to="/" className="hover:text-orange-500 transition-colors duration-300">
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/catalog" className="hover:text-orange-500 transition-colors duration-300">
//             Catalog
//           </Link>
//         </li>
//         <li>
//           <Link to="/appointments" className="hover:text-orange-500 transition-colors duration-300">
//             Book Vehicle Service
//           </Link>
//         </li>
//         <li>
//           <Link to="/repairRequestFrom" className="hover:text-orange-500 transition-colors duration-300">
//             Request Repair
//           </Link>
//         </li>
//         <li>
//           <Link to="/staff" className="hover:text-orange-500 transition-colors duration-300">
//             Staff
//           </Link>
//         </li>
//         <li>
//           <Link to="/import" className="hover:text-orange-500 transition-colors duration-300">
//             Import vehicle
//           </Link>
//         </li>
//         <li>
//           <Link to="/about-us" className="hover:text-orange-500 transition-colors duration-300">
//             About Us
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: "#111827",
      color: "white",
      padding: "1rem 1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#f97316"
      }}>COSMO EXPORTS</h2>
      <ul style={{
        display: "flex",
        gap: "1.5rem",
        listStyle: "none",
        margin: 0,
        padding: 0
      }}>
        <li>
          <Link 
            to="/" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/catalog" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Catalog
          </Link>
        </li>
        <li>
          <Link 
            to="/appointments" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Book Vehicle Service
          </Link>
        </li>
        <li>
          <Link 
            to="/repairRequestFrom" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Request Repair
          </Link>
        </li>
        <li>
          <Link 
            to="/staff" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Staff
          </Link>
        </li>
        <li>
          <Link 
            to="/import/vehicles" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            Import Vehicle
          </Link>
        </li>
        <li>
          <Link 
            to="/about-us" 
            style={{
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#f97316"}
            onMouseOut={(e) => e.currentTarget.style.color = "white"}
          >
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;