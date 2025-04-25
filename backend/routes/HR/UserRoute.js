import express from "express";
import { createEmployee,deleteEmployee,getEmployee,loginEmployee, resetPassword,requestOtp,verifyOtp } from "../../controllers/HR/UserControllers.js";
import { updateEmployee } from "../../controllers/HR/UserControllers.js";

const userRoute = express.Router();

// Specific routes first
userRoute.post("/login", loginEmployee);
userRoute.post("/request-otp", requestOtp);
userRoute.post("/verify-otp", verifyOtp);
userRoute.post("/reset-password", resetPassword);

// Root and parameter routes last
userRoute.get("/", getEmployee);
userRoute.post("/", createEmployee);
userRoute.put("/:id", updateEmployee);
userRoute.delete("/:id", deleteEmployee);

export default userRoute;