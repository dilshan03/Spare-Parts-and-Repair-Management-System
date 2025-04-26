import express from "express";
import {
  addBalanceSheet,
  getBalanceSheets,
  updateBalanceSheet,
  deleteBalanceSheet,
  getBalanceSheetById,
  downloadBalanceSheetPDF,
  downloadBalanceSheetByIdPDF,
} from "../../controllers/Finance/balanceSheetController.js"; // Adjust the path as necessary




const router = express.Router();

// 📌 Add Balance Sheet
router.post("/add", addBalanceSheet);

// 📌 Get All Balance Sheets
router.get("/all", getBalanceSheets);

// 📌 Get Balance Sheet by ID (New Route)
router.get("/:id", getBalanceSheetById); // This route is for fetching a single balance sheet by its ID

// 📌 Update Balance Sheet by ID
router.put("/update/:id", updateBalanceSheet);

// 📌 Delete Balance Sheet by ID
router.delete("/delete/:id", deleteBalanceSheet);

router.get('/download/:id', downloadBalanceSheetByIdPDF);

// GET /api/balance-sheet/download/all
router.get('/download/all', downloadBalanceSheetPDF);

export default router;
