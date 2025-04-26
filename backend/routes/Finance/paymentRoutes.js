import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import Payment from "../../models/Finance/Payment.js";
import MockCard from "../../models/Finance/MockCard.js";

const router = express.Router();

// Configure file storage for bank slips
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "esandidesilva20@gmail.com",
    pass: "wjke klmm gjwe jgbd",
  },
});

// Route to add a mock card
router.post("/mock-card", async (req, res) => {
  try {
    const { cardNumber, customerName, cvc, balance } = req.body;
    const newCard = new MockCard({ cardNumber, customerName, cvc, balance });
    await newCard.save();
    res.status(201).json({ success: true, message: "Mock card added successfully", newCard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding mock card", error });
  }
});

// Route to process payment
router.post("/process-payment", upload.single("bankSlip"), async (req, res) => {
  try {
    const { customerName, email, cardNumber, cvc, amount, paymentMethod } = req.body;
    let paymentStatus = "Processing";
    let bankSlipPath = req.file ? req.file.path : null;

    if (paymentMethod === "Cash on Delivery") {
      // Cash on Delivery: Automatically set status to "Processing"
      const payment = new Payment({ customerName, email, paymentMethod, amount, status: "Processing" });
      await payment.save();
      sendEmail(email, "Order Received", "Your Cash on Delivery payment is processing.");
      return res.json({ success: true, message: "Order placement successful", payment });
    }

    if (paymentMethod === "Online Bank Slip") {
      // Online Bank Slip: Upload slip and set status to "Processing"
      const payment = new Payment({ customerName, email, paymentMethod, amount, bankSlip: bankSlipPath, status: "Processing" });
      await payment.save();
      sendEmail(email, "Payment Received", "Your bank slip has been received. Your payment is processing.");
      return res.json({ success: true, message: "Order placement successful", payment });
    }

    if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
      // Validate card details
      const card = await MockCard.findOne({ cardNumber, customerName, cvc });
      if (!card) {
        return res.status(400).json({ success: false, message: "Invalid card details" });
      }

      // Check balance
      if (amount > card.balance) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
      }

      // Deduct balance
      card.balance -= amount;
      await card.save();

      // Save payment details
      const payment = new Payment({ customerName, email, paymentMethod, amount, status: "Success" });
      await payment.save();

      // Send email confirmation
      sendEmail(email, "Payment Successful", `Your payment of LKR${amount} was successful.`);
      return res.json({ success: true, message: "Payment successful", payment });
    }

    return res.status(400).json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment processing failed", error });
  }
});

// Route to update payment status (Admin can verify payments)
router.put("/update-payment-status/:id", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: paymentStatus }, { new: true });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // Send email to customer about the updated status
    sendEmail(payment.email, "Payment Status Updated", `Your payment status is now: ${paymentStatus}.`);
    
    res.json({ success: true, message: "Payment status updated successfully", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating payment status", error });
  }
});

// Route to get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payments", error });
  }
});

// Function to send email notifications
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "esandidesilva20@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default router;
