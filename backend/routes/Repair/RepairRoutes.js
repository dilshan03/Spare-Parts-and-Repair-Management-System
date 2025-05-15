import express from "express";
import {
  createRepair,
  getAllRepairs,
  getRepairById,
  updateRepair,
  deleteRepair,
  createRepairsForAllRequestForms,
  sendRepairCompletedEmail, 
} from "../../controllers/Repair/RepairController.js";

const router = express.Router();

// Create repairs for all RepairRequestForms
router.post("/create-from-all-request-forms", createRepairsForAllRequestForms);

// Get all repairs
router.get("/get-all-repairs", getAllRepairs);

// Send email after repair completion
router.post("/send-email/:id", sendRepairCompletedEmail);

// Create a new repair
router.post("/", createRepair);

// Get a repair by ID
router.get("/:id", getRepairById);

// Update a repair by ID
router.put("/:id", updateRepair);

// Delete a repair by ID
router.delete("/:id", deleteRepair);


export default router;