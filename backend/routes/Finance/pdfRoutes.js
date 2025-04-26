import express from "express";
import { generateBankStatementPDF } from "../controllers/pdfController.js";

const router = express.Router();
router.get("/generate-statement/:accountId", generateBankStatementPDF);

export default router;


//for bank book management