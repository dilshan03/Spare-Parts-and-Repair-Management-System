// productRoute.js
import express from "express";
import { addSparePart, getAllSpareParts, getSparePartById, updateSparePart, deleteSparePart, upload } from "../../controllers/Inventory/productController.js";

const router = express.Router();

// Routes
router.post("/", upload.single('picture'), addSparePart);
router.get("/", getAllSpareParts);
router.get("/:id", getSparePartById);
router.put("/:id", updateSparePart);
router.delete("/:id", deleteSparePart);

export default router;
