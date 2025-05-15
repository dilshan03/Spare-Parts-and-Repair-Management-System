"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

const SingleProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/spareparts/${id}`)
        setProduct(response.data)
      } catch (error) {
        setError("Failed to fetch product details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/spareparts/${id}`)
        navigate("/viewInventory")
      } catch (error) {
        setError("Failed to delete the product. Please try again.")
      }
    }
  }

  const handleUpdate = () => {
    navigate(`/update/${id}`)
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Fixed Sidebar */}
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
            <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>Product Details</h2>
            <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            {[
              { path: "/addProducts", name: "Add Inventory" },
              { path: "/manageInventory", name: "Manage Inventory" },
              { path: "/viewInventory", name: "View Inventory" },
              { path: "/reports", name: "Inventory Reports" },
              { path: "/inventoryHome", name: "Main Inventory" },
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
              to="/inventoryHome" 
              className="btn btn-primary w-100 py-2"
              style={{ 
                fontWeight: "500",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-primary m-0">Product Details</h1>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <div className="card shadow-sm mb-4">
                  <div className="row g-0">
                    <div className="col-md-6">
                      <img
                        src={`http://localhost:5000/${product.picture}`}
                        alt={product.name}
                        className="img-fluid rounded-start"
                        style={{ height: "100%", objectFit: "cover", minHeight: "300px" }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="card-body">
                        <h2 className="card-title mb-3">{product.name}</h2>
                        <div className="d-flex align-items-center mb-4">
                          <h3 className="text-primary me-3">${product.price}</h3>
                          <span className={`badge ${product.quantity > 0 ? "bg-success" : "bg-danger"}`}>
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-muted">Description</h5>
                          <p className="card-text">{product.description}</p>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <h5 className="text-muted">Category</h5>
                            <p>{product.category}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <h5 className="text-muted">Condition</h5>
                            <p>{product.condition}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <h5 className="text-muted">Quantity</h5>
                            <p>{product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h4 className="mb-4">Product Actions</h4>
                    <div className="d-grid gap-3">
                      <button 
                        onClick={() => navigate("/viewInventory")} 
                        className="btn btn-outline-primary py-2"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Inventory
                      </button>
                      <button 
                        onClick={handleUpdate} 
                        className="btn btn-warning py-2"
                      >
                        <i className="bi bi-pencil-square me-2"></i>
                        Update Product
                      </button>
                      <button 
                        onClick={handleDelete} 
                        className="btn btn-danger py-2"
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleProduct