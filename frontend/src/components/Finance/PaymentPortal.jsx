import React, { useState } from "react";
import axios from "axios";

const PaymentPortal = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    cardNumber: "",
    cvc: "",
    amount: "",
    paymentMethod: "",
    bankSlip: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validateField = (name, value) => {
    let error = "";

    // Customer Name validation: Only letters and spaces allowed
    if (name === "customerName") {
      if (!value.trim()) {
        error = "Customer name is required.";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        error = "Customer name must contain only letters and spaces.";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Invalid email format.";
    }

    if (name === "cardNumber") {
      const cardRegex = /^\d{16}$/;
      if (!cardRegex.test(value)) error = "Card number must be 16 digits.";
    }

    if (name === "cvc") {
      const cvcRegex = /^\d{3}$/;
      if (!cvcRegex.test(value)) error = "CVC must be 3 digits.";
    }

    if (name === "amount") {
      if (!value || isNaN(value) || Number(value) <= 0) error = "Enter a valid amount.";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, bankSlip: file }));

    if (!file) {
      setErrors((prevErrors) => ({ ...prevErrors, bankSlip: "Bank slip is required." }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, bankSlip: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (
        formData.paymentMethod === "Credit Card" ||
        formData.paymentMethod === "Debit Card"
      ) {
        if (["customerName", "email", "cardNumber", "cvc", "amount"].includes(key)) {
          newErrors[key] = validateField(key, formData[key]);
        }
      } else if (formData.paymentMethod === "Online Bank Slip") {
        if (["customerName", "email", "amount"].includes(key)) {
          newErrors[key] = validateField(key, formData[key]);
        }
        if (!formData.bankSlip) {
          newErrors.bankSlip = "Bank slip is required.";
        }
      } else if (formData.paymentMethod === "Cash on Delivery") {
        if (["customerName", "email", "amount"].includes(key)) {
          newErrors[key] = validateField(key, formData[key]);
        }
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (hasErrors) {
      console.log("Form has errors:", newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const token = localStorage.getItem('token');

      const response = await axios.post(
        "http://localhost:5000/api/payments/process-payment",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },

        }
      );
      setMessage(response.data.message);

      setFormData({
        customerName: "",
        email: "",
        cardNumber: "",
        cvc: "",
        amount: "",
        paymentMethod: "",
        bankSlip: null,
      });

      const fileInput = document.getElementById("bankSlipInput");
      if (fileInput) {
        fileInput.value = "";
      }

      setErrors({});
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/uploads/paymentPortal.jpg')" }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Payment Portal</h2>
        {message && <div className="text-green-600 bg-green-100 p-2 mb-3 rounded">{message}</div>}
        {error && <div className="text-red-600 bg-red-100 p-2 mb-3 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              name="paymentMethod"
              onChange={handleChange}
              value={formData.paymentMethod}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Online Bank Slip">Online Bank Slip</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {formData.paymentMethod && (
            <>
              <div>
                <label className="block text-sm font-medium">Customer Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  name="customerName"
                  placeholder="Enter your name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
                {errors.customerName && <p className="text-red-600 text-sm">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
                {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
              </div>

              {(formData.paymentMethod === "Credit Card" || formData.paymentMethod === "Debit Card") && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Card Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                      name="cardNumber"
                      placeholder="Enter card number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                    {errors.cardNumber && <p className="text-red-600 text-sm">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">CVC</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                      name="cvc"
                      placeholder="Enter CVC"
                      value={formData.cvc}
                      onChange={handleChange}
                      required
                    />
                    {errors.cvc && <p className="text-red-600 text-sm">{errors.cvc}</p>}
                  </div>
                </>
              )}

              {formData.paymentMethod === "Online Bank Slip" && (
                <>
                  <div className="text-blue-600 bg-blue-100 p-2 rounded">
                    Company Account Details: 100254879650 (Sampath Bank - Nugegoda Branch)
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Upload Bank Slip</label>
                    <input
                      type="file"
                      className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                      name="bankSlip"
                      id="bankSlipInput"
                      onChange={handleFileChange}
                      required
                    />
                    {errors.bankSlip && <p className="text-red-600 text-sm">{errors.bankSlip}</p>}
                  </div>
                </>
              )}

              {formData.paymentMethod === "Cash on Delivery" && (
                <div className="text-yellow-600 bg-yellow-100 p-2 rounded">
                  Payment Status: Processing
                </div>
              )}

              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Pay Now
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentPortal;
