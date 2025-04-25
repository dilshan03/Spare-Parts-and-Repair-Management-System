//password= 267KnrH0FysJKJmS
//"mongodb+srv://admin:267KnrH0FysJKJmS@cluster0.taukt.mongodb.net/"

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import leaveRouter from "./routes/LeaveRoute.js";
import salaryRouter from "./routeSalaryRoute.js";
import RepairRequestFromRoute from "./routes/Repair/RepairRequestFromRoute.js";//RY
import RepairRoute from "./routes/Repair/RepairRoutes.js"; // Import Repair Rout
import jobCardRoutes from "./routes/Repair/JobCardRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"]
}));

// Enable pre-flight requests for all routes
app.options("*", cors()); 

app.use(bodyParser.json({ limit: "100mb" }));  // Increase JSON limit to 50MB //RY
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));  // Increase form-data limit //RY


app.use((req,res,next)=>{

    const publicRoutes = [
        "/api/employees/login",
        "/api/employees/request-otp",
        "/api/employees/verify-otp",
        "/api/employees/reset-password"
    ];
    
    if (publicRoutes.includes(req.originalUrl)) {
        console.log(`Bypassing auth for: ${req.originalUrl}`);
        return next();
    }

    let token = req.header("Authorization")

    if(token){
        token = token.replace("Bearer ", "")
        jwt.verify(token,process.env.jwt,(error, decoded)=>{
            if(error){
                res.status(401).json({
                    error : "Invalid token"
                    
                })
                return;
            }
            req.user=decoded;
            next();
            
        })
    }
    else{
        res.status(401).json({
            error : "Authorization token required"
        })
        return;
    }
})

let mongoUrl = process.env.MONGO_URL;


mongoose.connect(mongoUrl);

const conn = mongoose.connection;

conn.once("open",()=>{
    console.log("Connection established")
})

app.use("/api/employees",userRoute);//ID
app.use("/api/leave",leaveRouter);//ID
app.use("/api/salary",salaryRouter); //ID
app.use("/repairRequest",RepairRequestFromRoute);//RY
app.use("/repairs", RepairRoute); //RY
app.use("/jobCards", jobCardRoutes); //RY 


app.listen(5000,()=>{
    console.log ("Server running on port 5000");
})


