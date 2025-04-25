 
import express from "express";
import { createJobCard, getAllJobCards,getJobCardById,updateJobCard,} from "../controllers/jobCardController.js";

const router = express.Router();

// Route to create a JobCard
router.post("/", createJobCard);
router.get("/", getAllJobCards);

// Get single job card
router.get('/:id', getJobCardById);

// Update job status
// router.patch('/:id', updateJobStatus);

router.put("/:id", updateJobCard);

export default router;