// routes/reportRoutes.js
import express from "express";
import { getMonthlySalesReport } from "../../controllers/Inventory/reportController.js";

const router = express.Router();

router.get("/monthly", getMonthlySalesReport);

export default router;
