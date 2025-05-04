"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useCart } from "./cartContext.jsx"
import "bootstrap/dist/css/bootstrap.min.css"

const ViewProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
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

  const handleAddToCart = () => {
    addToCart(product)
    alert(`${product.name} has been added to your cart!`)
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Fixed Sidebar - unchanged */}
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
            <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>Product View</h2>
            <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            {[
              { path: "/home", name: "Home" },
              { path: "/viewAllProducts", name: "View Products" },
              { path: "/cart", name: "My Cart" },
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
                  <div className="card-body">
                    {/* Image at the top */}
                    <div className="text-center mb-4">
                      <img
                        src={`http://localhost:5000/${product.picture}`}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "400px", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Product details below image */}
                    <div className="product-details">
                      <h2 className="mb-3 text-center">{product.name}</h2>
                      
                      {/* Centered price and stock status */}
                      <div className="d-flex justify-content-center align-items-center mb-4">
                        <h3 className="text-primary me-3 mb-0">${product.price}</h3>
                        <span className={`badge ${product.quantity > 0 ? "bg-success" : "bg-danger"}`}>
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h5 className="mb-3">Description</h5>
                        <p className="card-text">{product.description}</p>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="d-flex">
                            <h5 className="me-3" style={{ minWidth: "120px" }}>Category:</h5>
                            <p>{product.category}</p>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex">
                            <h5 className="me-3" style={{ minWidth: "120px" }}>Condition:</h5>
                            <p>{product.condition}</p>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex">
                            <h5 className="me-3" style={{ minWidth: "120px" }}>Quantity:</h5>
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
                        onClick={() => navigate("/viewAllProducts")} 
                        className="btn btn-outline-primary py-2"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        View All Products
                      </button>
                      <button 
                        onClick={handleAddToCart} 
                        className="btn btn-success py-2"
                        disabled={product.quantity <= 0}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                      <button 
                        onClick={() => navigate("/cart")} 
                        className="btn btn-primary py-2"
                      >
                        <i className="bi bi-cart-check me-2"></i>
                        Go to Cart
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

export default ViewProduct