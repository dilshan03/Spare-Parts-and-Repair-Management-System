import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h4>COSMO EXPORTS </h4> 
        </div>
        

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Advanced Search</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Service</h3>
          <ul>
            <li>Specials</li>
            <li>Offers</li>
            <li>About Us</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>📍 496/1, Naduhena, Meegoda, Sri Lanka.</li>
            <li>📧 cosmoexportslanka@gmail.com</li>
            <li>📞 +94 77 086 4011  |  +94 11 275 2373</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>@2025 Cosmo Exports Lanka (Pvt). Copyright</p>
        <div className="social-icons">
          <span>🔵</span> {/* Replace with actual icons */}
          <span>🔴</span>
          <span>⚫</span>
          <span>⚪</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
