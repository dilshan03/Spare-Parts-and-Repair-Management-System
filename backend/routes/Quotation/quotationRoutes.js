import express from "express";
import {
  createQuotation,   // <-- Corrected import
  getQuotations,
  getQuotationById,
  deleteQuotation,
  sendQuotationEmail,
  updateQuotationStatus
} from "../../controllers/quotationController.js";

const router = express.Router();

// Create a new quotation
router.post("/", createQuotation);  // <-- Corrected route

// Get all quotations
router.get("/", getQuotations);

// Get a specific quotation by ID
router.get("/:id", getQuotationById);

// Delete a quotation by ID
router.delete("/:id", deleteQuotation);

// Send quotation email
router.post("/send-email/:id", sendQuotationEmail);

// Update status of a quotation (Pending -> Accepted/Rejected)
router.put("/:id/status", updateQuotationStatus);

export default router;
