import express from "express";


import {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions
  } from "../../controllers/Finance/bankBookController.js"; // Adjust the path as necessary

const router = express.Router();

// Route for adding a transaction to the bank book
router.post("/add-transaction", addTransaction);
router.put("/transaction/update/:transactionId", updateTransaction);
router.delete("/transaction/delete/:transactionId", deleteTransaction);
router.get("/transactions", getAllTransactions);

export default router;
