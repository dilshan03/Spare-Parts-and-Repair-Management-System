"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d6efd",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555555",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#0d6efd",
    color: "#ffffff",
    padding: 5,
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#555555",
  },
})

// PDF Document Component
const InventoryReportPDF = ({ salesData, recentProducts, month }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src="/images/inventory-logo.jpg" style={styles.logo} />
        <View>
          <Text style={styles.title}>Cosmo Exports Lanka (PVT) LTD</Text>
          <Text style={styles.subtitle}>Inventory Report - {month}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Added Products</Text>
        {recentProducts.length > 0 ? (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Product Name</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Date Added</Text>
            </View>
            {recentProducts.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{product.name}</Text>
                <Text style={styles.tableCell}>{product.category || "N/A"}</Text>
                <Text style={styles.tableCell}>{product.createdAt}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>No products added during this period.</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text>Generated on {new Date().toLocaleDateString()} | Cosmo Exports Lanka (PVT) LTD</Text>
      </View>
    </Page>
  </Document>
)

const SalesAndInventoryReports = () => {
  const [salesData, setSalesData] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [month, setMonth] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // get monthly products according to set month
  const selectedMonthIndex = MONTHS.indexOf(month) + 1; // 1-based index
  const monthNumber = selectedMonthIndex.toString().padStart(2, '0'); // '03'
  const filteredProducts = recentProducts.filter((product) => {
    const productMonth = new Date(product.dateAdded || product.createdAt).getMonth() + 1;
    const formattedMonth = productMonth.toString().padStart(2, '0');
    return formattedMonth === monthNumber;
  });

  // Fetch data whenever month changes
  useEffect(() => {
    if (month) {
      setIsLoading(true)
      setIsLoading(false)
    }
    fetchRecentProducts()
  }, [month])

  // Fetch recently added products
  const fetchRecentProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/spareparts`)
      setRecentProducts(response.data)
      
    } catch (error) {
      setMessage("Error fetching recently added products data")
      // If API fails, use sample data for demonstration
      setRecentProducts([
        { name: "Brake Pad", category: "Brakes", dateAdded: "2023-04-15" },
        { name: "Air Filter", category: "Filters", dateAdded: "2023-04-10" },
        { name: "Engine Oil", category: "Fluids", dateAdded: "2023-04-05" },
      ])
    }
  }

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Enhanced Sidebar with dark blue theme */}
      <div
        className="bg-dark text-white p-4 d-flex flex-column"
        style={{ 
          width: "250px", 
          height: "100vh", 
          position: "fixed", 
          top: 0, 
          left: 0,
          background: "#1e2a4a", /* Dark blue background */
          boxShadow: "4px 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <div className="mb-4">
          <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>Inventory System</h2>
          <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
        </div>

        {/* Navigation Menu with icons */}
        <ul className="list-unstyled flex-grow-1">
          <li className="mb-3">
            <a href="/addProducts" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Inventory</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/manageInventory" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span>Manage Inventory</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/viewInventory" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>View Inventory</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/reports" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ 
                transition: "all 0.2s", 
                padding: "10px", 
                background: "rgba(77, 159, 255, 0.2)", /* Highlight current page */
                borderLeft: "4px solid #4d9fff"
              }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Inventory Reports</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/inventoryHome" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Main Inventory</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/viewAllProducts" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Customer View</span>
            </a>
          </li>
        </ul>

        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Link to="/inventoryHome" className="btn btn-lg d-flex align-items-center justify-content-center" 
            style={{ 
              background: "#4d9fff", 
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
            Back to main Inventory page
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#1e2a4a", fontWeight: "bold" }}>Sales and Inventory Reports</h1>
        </div>

        {/* Month Input */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <label htmlFor="month-input" className="form-label text-secondary mb-2">
                <svg width="18" height="18" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Select Month for Report:
              </label>
              <select
                id="month-input"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
                className="form-select"
                style={{ 
                  boxShadow: "none", 
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  padding: "10px 14px"
                }}
              >
                <option value="">Select a month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mt-3 mt-md-0 d-flex justify-content-md-end">
              {month && (
                <PDFDownloadLink
                  document={<InventoryReportPDF salesData={salesData} recentProducts={recentProducts} month={month} />}
                  fileName={`inventory-report-${month}.pdf`}
                  className="btn d-flex align-items-center"
                  style={{ 
                    textDecoration: "none",
                    background: "#4d9fff",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {({ blob, url, loading, error }) => (loading ? "Generating PDF..." : "Download PDF Report")}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {message}
          </div>
        )}
        
        {isLoading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading data...</span>
            </div>
          </div>
        )}

        {/* Recently Added Products Section */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="d-flex align-items-center mb-3">
            <svg width="22" height="22" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 style={{ color: "#1e2a4a", fontWeight: "600", marginBottom: "0" }}>Recently Added Products</h3>
          </div>
          <div style={{ height: "1px", background: "#e9ecef", marginBottom: "16px" }}></div>

          {filteredProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={{ color: "#1e2a4a", fontWeight: "600", borderBottom: "2px solid #4d9fff" }}>Product Name</th>
                    <th style={{ color: "#1e2a4a", fontWeight: "600", borderBottom: "2px solid #4d9fff" }}>Category</th>
                    <th style={{ color: "#1e2a4a", fontWeight: "600", borderBottom: "2px solid #4d9fff" }}>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td>{product.name}</td>
                      <td>
                        <span className="badge bg-light text-dark" style={{ fontWeight: "500" }}>
                          {product.category || "N/A"}
                        </span>
                      </td>
                      <td>{product.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4" style={{ background: "#f8f9fa", borderRadius: "6px" }}>
              <svg width="40" height="40" fill="none" stroke="#6c757d" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "15px", opacity: "0.5" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p className="text-muted">
                No products added during the selected month. Please select a month to view data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesAndInventoryReports