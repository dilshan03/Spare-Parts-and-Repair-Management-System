"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"

const ViewInventory = () => {
  const [spareParts, setSpareParts] = useState([])
  const [filteredParts, setFilteredParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/spareparts")
        console.log('Fetched parts:', response.data)
        setSpareParts(response.data)
        setFilteredParts(response.data)

        // Extract unique categories for filter dropdown
        const uniqueCategories = [...new Set(response.data.map((part) => part.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        setError("Failed to fetch inventory. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchSpareParts()
  }, [])

  // Filter parts based on search term and category
  useEffect(() => {
    let result = spareParts

    if (searchTerm) {
      result = result.filter(
        (part) =>
          part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter) {
      result = result.filter((part) => part.category === categoryFilter)
    }

    setFilteredParts(result)
  }, [searchTerm, categoryFilter, spareParts])

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
              style={{ 
                transition: "all 0.2s", 
                padding: "10px", 
                background: "rgba(77, 159, 255, 0.2)", /* Highlight current page */
                borderLeft: "4px solid #4d9fff"
              }}>
              <svg width="20" height="20" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>View Inventory</span>
            </a>
          </li>
          <li className="mb-3">
            <a href="/reports" className="text-white text-decoration-none d-flex align-items-center p-2 rounded" 
              style={{ transition: "all 0.2s", padding: "10px", ":hover": { background: "rgba(255,255,255,0.1)" } }}>
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
          <h1 style={{ color: "#1e2a4a", fontWeight: "bold" }}>View Inventory</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <svg width="16" height="16" fill="none" stroke="#4d9fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ boxShadow: "none" }}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn w-100"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("")
                }}
                style={{ 
                  background: "#e9ecef", 
                  color: "#495057",
                  border: "none"
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading inventory...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredParts.length === 0 ? (
          <div className="alert alert-info shadow-sm">No products found matching your criteria.</div>
        ) : (
          <div className="row">
            {filteredParts.map((part) => (
              <div key={part._id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100 border-0" style={{ transition: "transform 0.2s", ":hover": { transform: "translateY(-5px)" } }}>
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={part.picture || "/placeholder.svg?height=200&width=200"}
                      alt={part.name}
                      className="card-img-top"
                      style={{ height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-truncate">{part.name}</h5>
                    <p className="card-text">
                      <span className="badge bg-light text-dark mb-2" style={{ fontSize: "0.8rem" }}>{part.category}</span>
                    </p>
                    <p className="card-text fw-bold text-primary fs-5 mt-auto">
                      ${part.price}
                    </p>
                    <Link 
                      to={`/SingleProduct/${part._id}`} 
                      className="btn mt-2"
                      style={{ 
                        background: "#4d9fff", 
                        color: "white",
                        border: "none",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Product
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewInventory