"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "./cartContext"
import "bootstrap/dist/css/bootstrap.min.css"

const ViewAllProducts = () => {
  const [spareParts, setSpareParts] = useState([])
  const [filteredParts, setFilteredParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])
  const { cartItems, addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/spareparts")
        setSpareParts(response.data)
        setFilteredParts(response.data)

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
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Fixed Sidebar - matching ViewProduct style */}
      <div
        className="text-white p-4 d-flex flex-column position-fixed"
        style={{ 
          width: "250px", 
          height: "100vh",
          backgroundImage: "url('/images/nav_pic.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(30, 42, 74, 0.85)",
            zIndex: 0
          }}
        />

        {/* Navigation content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="mb-4">
            <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>All Products</h2>
            <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            {[
              { path: "/home", name: "Home" },
              { path: "/viewAllProducts", name: "View Products" },
              { path: "/cart", name: "My Cart" },
              { path: "/aboutUs", name: "About Us" },
              { path: "/account", name: "My Account" },
            ].map((item) => (
              <li key={item.name} className="mb-2">
                <Link 
                  to={item.path} 
                  className="text-white text-decoration-none d-block p-3 rounded hover-bg-primary"
                  style={{ 
                    transition: "all 0.3s",
                    borderLeft: "4px solid transparent",
                    ":hover": {
                      background: "rgba(77, 159, 255, 0.3)",
                      borderLeft: "4px solid #4d9fff"
                    }
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <Link 
              to="/home" 
              className="btn btn-primary w-100 py-2"
              style={{ 
                fontWeight: "500",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        {/* View Cart Button */}
        <div className="d-flex justify-content-end mb-4">
          <Link to="/cart" className="btn btn-warning position-relative">
            <i className="bi bi-cart3 me-2"></i>
            View Cart
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary m-0">All Products</h1>
          <div className="text-muted">
            Showing {filteredParts.length} of {spareParts.length} items
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-filter"></i>
                  </span>
                  <select 
                    className="form-select" 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("")
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredParts.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-exclamation-circle display-4 text-muted mb-3"></i>
              <h4>No products found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("")
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredParts.map((part) => (
              <div key={part._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={part.picture || "/placeholder.svg"}
                      alt={part.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "contain", padding: "20px" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <span 
                      className={`position-absolute top-0 end-0 m-2 badge ${part.quantity > 0 ? "bg-success" : "bg-danger"}`}
                    >
                      {part.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{part.name}</h5>
                    <div className="mb-2">
                      <span className="badge bg-light text-dark">{part.category}</span>
                    </div>
                    <h4 className="text-primary mb-3">${part.price}</h4>
                    <div className="mt-auto d-grid gap-2">
                      <button
                        onClick={() => navigate(`/viewProduct/${part._id}`)}
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-eye me-2"></i>View Details
                      </button>
                      <button
                        onClick={() => addToCart(part)}
                        className="btn btn-success"
                        disabled={part.quantity <= 0}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                    </div>
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

export default ViewAllProducts