import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const InventoryHome = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" 
         style={{ 
           height: "100vh", 
           width: "100%",
           backgroundImage: "url('/images/InventoryHome.jpg')", 
           backgroundSize: "cover", 
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat",
           position: "fixed",
           top: 0,
           left: 0,
           right: 0,
           bottom: 0
         }}>
      
      <div className="p-5 rounded shadow-lg text-center" 
           style={{ 
             background: "#1e2a4a", 
             color: "white", 
             opacity: 0.95,
             maxWidth: "500px",
             borderRadius: "12px",
             boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
           }}>
        <h1 className="mb-4" style={{ color: "#fff", fontWeight: "bold", marginBottom: "1.5rem" }}>
          Inventory Management
        </h1>
        <div style={{ width: "80px", height: "4px", background: "#4d9fff", borderRadius: "2px", margin: "0 auto 2rem auto" }}></div>
        
        <div className="d-grid gap-4 w-100">
          <Link to="/viewInventory" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(77, 159, 255, 0.15)", 
                  color: "white",
                  border: "1px solid rgba(77, 159, 255, 0.3)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            View Inventory
          </Link>
          
          <Link to="/addProducts" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(77, 159, 255, 0.15)", 
                  color: "white",
                  border: "1px solid rgba(77, 159, 255, 0.3)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Products
          </Link>
          
          <Link to="/manageInventory" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(77, 159, 255, 0.15)", 
                  color: "white",
                  border: "1px solid rgba(77, 159, 255, 0.3)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Manage Inventory
          </Link>
          
          <Link to="/reports" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(77, 159, 255, 0.15)", 
                  color: "white",
                  border: "1px solid rgba(77, 159, 255, 0.3)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Reports
          </Link>
          
          <Link to="/viewAllProducts" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(77, 159, 255, 0.15)", 
                  color: "white",
                  border: "1px solid rgba(77, 159, 255, 0.3)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(77, 159, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Customer View
          </Link>
          
          <div style={{ height: "20px" }}></div>
          
          <Link to="/adminDashboard" className="btn btn-lg d-flex align-items-center justify-content-center" 
                style={{ 
                  background: "#4d9fff", 
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  fontWeight: "500",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#3a8be6";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#4d9fff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InventoryHome;