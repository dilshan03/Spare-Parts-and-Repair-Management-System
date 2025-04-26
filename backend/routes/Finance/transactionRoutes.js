import express from "express";
import transactionController from "../controllers/transactionController.js"; // ✅ Import as default
const router = express.Router();

// Add a new transaction (Triggered when payment is successful)
router.post("/add", transactionController.addTransaction);

// Get all transactions (For admin dashboard)
router.get("/all", transactionController.getTransactions);

// Get transaction summary (Total revenue, etc.)
router.get("/summary", transactionController.getTransactionSummary);


export default router;