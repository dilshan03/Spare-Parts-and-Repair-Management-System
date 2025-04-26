//password= 267KnrH0FysJKJmS
//"mongodb+srv://admin:267KnrH0FysJKJmS@cluster0.taukt.mongodb.net/"

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/HR/UserRoute.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import leaveRouter from "./routes/HR/LeaveRoute.js";
import salaryRouter from "./routes/HR/SalaryRoute.js";
import RepairRequestFromRoute from "./routes/Repair/RepairRequestFromRoute.js";//RY
import RepairRoute from "./routes/Repair/RepairRoutes.js"; // Import Repair Rout
import jobCardRoutes from "./routes/Repair/JobCardRoutes.js";

import financeRoutes from "./routes/Finance/finance.js"; //Esandi
import balanceSheetRoutes from './routes/Finance/balanceSheetRoutes.js';//Esandi
import bankBookRoutes from './routes/Finance/bankBookRoutes.js'; //Esandi
import profitLossRoutes from './routes/Finance/profitLossRoutes.js'; //Esandi
import pettyCashRoutes from './routes/Finance/pettyCashRoutes.js'; //Esandi
import paymentRoutes from './routes/Finance/paymentRoutes.js'; //Esandi
import bankAccountRoutes from './routes/Finance/bankAccountRoutes.js'; //Esandi
//import pdfRoutes from "./routes/pdfRoutes.js";




import cors from "cors";

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

app.use(bodyParser.json({ limit: "100mb" }));  // Increase JSON limit to 50MB //RY
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));  // Increase form-data limit //RY



app.use((req,res,next)=>{
    // Define public routes and their patterns
    const publicRoutes = [
        "/api/employees/login",
        "/api/employees/request-otp",
        "/api/employees/verify-otp",
        "/api/employees/reset-password"
    ];
    
    // Check if the request URL matches any public route
    if (publicRoutes.some(route => req.originalUrl === route)) {
        console.log(`Bypassing auth for: ${req.originalUrl}`);
        return next();
    }

    let token = req.header("Authorization")

    if(token){
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.jwt, (error, decoded) => {
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

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(mongoUri);

const conn = mongoose.connection;

conn.once("open",()=>{
    console.log("Connection established")
})

app.use("/api/employees", userRoute); //ID
app.use("/api/leave", leaveRouter); //ID
app.use("/api/salary", salaryRouter); //ID
app.use("/api/repairRequest", RepairRequestFromRoute); //RY
app.use("/api/repairs", RepairRoute); //RY
app.use("/api/jobCards", jobCardRoutes); //RY


app.use('/api/payments', paymentRoutes);
app.use('/api/balance-sheet', balanceSheetRoutes);
app.use('/api/bank-book', bankBookRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/profit-loss', profitLossRoutes);
app.use('/api/pettycash', pettyCashRoutes);
app.use("/api/finance", financeRoutes); // Use finance routes
app.use("/api", financeRoutes);;
app.use('/api/profit-loss', profitLossRoutes);
//app.use("/api/pdf", pdfRoutes);


app.listen(5000,()=>{
    console.log ("Server running on port 5000");
})


