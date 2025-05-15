import { useCart } from "./cartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
            <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>Shopping Cart</h2>
            <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            {[
              { path: "/home", name: "Home" },
              { path: "/aboutUs", name: "About Us" },
              { path: "/cart", name: "My Cart", active: true },
              { path: "/account", name: "My Account" },
              { path: "/viewAllProducts", name: "View Products" },
              { path: "#other", name: "Other" },
            ].map((item) => (
              <li key={item.name} className="mb-2">
                <a 
                  href={item.path} 
                  className={`text-white text-decoration-none d-block p-3 rounded ${item.active ? "bg-primary" : "hover-bg-primary"}`}
                  style={{ 
                    transition: "all 0.3s",
                    borderLeft: item.active ? "4px solid #4d9fff" : "4px solid transparent"
                  }}
                >
                  {item.name}
                </a>
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

      {/* Full-width Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <div className="container-fluid px-0"> {/* Remove horizontal padding */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-primary m-0">Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart} 
                className="btn btn-outline-danger"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="card shadow-sm w-100"> {/* Full width card */}
              <div className="card-body text-center py-5">
                <h4 className="text-muted mb-3">Your cart is empty</h4>
                <Link to="/viewAllProducts" className="btn btn-primary px-4">
                  Continue shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-3"> {/* Full width rows */}
              <div className="col-12"> {/* Full width column */}
                {cartItems.map((item) => (
                  <div key={item._id} className="card mb-3 shadow-sm w-100"> {/* Full width cards */}
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-4 mb-3 mb-md-0">
                          <h5 className="card-title mb-1">{item.name}</h5>
                          <p className="card-text text-muted mb-0">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                            min="1"
                            className="form-control"
                            style={{ maxWidth: "80px" }}
                          />
                        </div>
                        <div className="col-md-4 text-md-end">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="btn btn-outline-danger"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-12"> {/* Full width summary */}
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h4 className="mb-4">Order Summary</h4>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <strong>Total:</strong>
                      <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                    <Link 
                      to="/Checkout" 
                      className="btn btn-primary w-100 py-2 mb-2"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link 
                      to="/viewAllProducts" 
                      className="btn btn-outline-secondary w-100 py-2"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;