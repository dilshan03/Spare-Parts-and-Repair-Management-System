"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

const ManageInventory = () => {
  const [spareParts, setSpareParts] = useState([])
  const [filteredParts, setFilteredParts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/spareparts")
        setSpareParts(response.data)
        setFilteredParts(response.data)
      } catch (error) {
        console.error("Error fetching spare parts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpareParts()
  }, [])

  // Memoized filter function to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term)

      if (!term.trim()) {
        setFilteredParts(spareParts)
        return
      }

      const lowercaseTerm = term.toLowerCase()
      const filtered = spareParts.filter(
        (part) =>
          part.name.toLowerCase().includes(lowercaseTerm) || part.category.toLowerCase().includes(lowercaseTerm),
      )
      setFilteredParts(filtered)
    },
    [spareParts],
  )

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this spare part?")) {
      try {
        await axios.delete(`http://localhost:5000/api/spareparts/${id}`)
        const updatedParts = spareParts.filter((part) => part._id !== id)
        setSpareParts(updatedParts)
        setFilteredParts(
          searchTerm
            ? updatedParts.filter(
                (part) =>
                  part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  part.category.toLowerCase().includes(searchTerm.toLowerCase()),
              )
            : updatedParts,
        )
      } catch (error) {
        console.error("Error deleting spare part:", error)
      }
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
              style={{ 
                transition: "all 0.2s", 
                padding: "10px", 
                background: "rgba(77, 159, 255, 0.2)", /* Highlight current page */
                borderLeft: "4px solid #4d9fff"
              }}>
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

      {/* Main Content - Unchanged functionality */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h1 className="text-primary mb-4">Manage Inventory</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: "800px" }}>
            {filteredParts.length === 0 ? (
              <div className="alert alert-info">No products found matching your search.</div>
            ) : (
              <table className="table table-bordered">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.map((part) => (
                    <tr key={part._id}>
                      <td>
                        <img
                          src={part.picture || "/placeholder.svg?height=50&width=50"}
                          alt={part.name}
                          className="img-thumbnail"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </td>
                      <td>{part.name}</td>
                      <td>{part.category}</td>
                      <td>${part.price}</td>
                      <td>{part.quantity}</td>
                      <td>
                        <Link to={`/update/${part._id}`} className="btn btn-sm btn-warning me-2">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(part._id)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        <a href="/viewInventory" className="btn btn-info mt-3">
          View Inventory
        </a>
      </div>
    </div>
  )
}

export default ManageInventory