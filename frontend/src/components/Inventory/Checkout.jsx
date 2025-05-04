import { useCart } from "./cartContext";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cartItems } = useCart();

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
            <h2 style={{ color: "#4d9fff", fontSize: "1.5rem", fontWeight: "bold" }}>Checkout</h2>
            <div style={{ width: "60px", height: "4px", background: "#4d9fff", borderRadius: "2px" }}></div>
          </div>

          <ul className="list-unstyled flex-grow-1">
            {[
              { path: "/home", name: "Home" },
              { path: "/aboutUs", name: "About Us" },
              { path: "/cart", name: "My Cart" },
              { path: "/account", name: "My Account" },
              { path: "/viewAllProducts", name: "View Products" },
              { path: "#other", name: "Other" },
            ].map((item) => (
              <li key={item.name} className="mb-2">
                <a 
                  href={item.path} 
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
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-primary m-0">Checkout</h1>
          </div>

          <div className="row g-4">
            {/* Order Summary - Full Width */}
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h3 className="mb-4">Order Summary</h3>
                  {cartItems.map((item) => (
                    <div key={item._id} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text text-muted">${item.price.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <div className="col-md-6 text-md-end">
                            <p className="card-text fw-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Total - Full Width */}
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h3 className="mb-4">Order Total</h3>
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
                    to="/paymentPortal" 
                    className="btn btn-primary w-100 py-3 mb-3"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Pay Now
                  </Link>
                  <Link 
                    to="/cart" 
                    className="btn btn-outline-secondary w-100 py-2"
                  >
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;