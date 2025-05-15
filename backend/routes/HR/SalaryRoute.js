import express from "express";
import { generateSalary, getAllSalaries } from "../../controllers/HR/SalaryController.js";


const salaryRouter = express.Router();

// Get all salaries (Admin only)
salaryRouter.get("/", getAllSalaries);

// Generate salary (Admin only)
salaryRouter.post("/", generateSalary);


export default salaryRouter;
