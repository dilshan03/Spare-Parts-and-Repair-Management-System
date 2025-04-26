import express from "express";
import {
  addTransactionToAccount,
  getTransactionsByAccount,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
} from "../../controllers/Finance/bankBookController.js";

const router = express.Router();

router.post("/:accountId/add-transaction", addTransactionToAccount);
router.get("/:accountId/transactions", getTransactionsByAccount);
router.put("/transaction/:transactionId", updateTransaction);
router.delete("/transaction/:transactionId", deleteTransaction);
router.get("/", getAllTransactions);

export default router;
