import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/HR/UserRoute.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import leaveRouter from "./routes/HR/LeaveRoute.js";
import salaryRouter from "./routes/HR/SalaryRoute.js";
import RepairRequestFromRoute from "./routes/Repair/RepairRequestFromRoute.js";
import RepairRoute from "./routes/Repair/RepairRoutes.js";
import jobCardRoutes from "./routes/Repair/JobCardRoutes.js";
import quotationRoutes from "./routes/Quotation/quotationRoutes.js";
import appointmentRoutes from "./routes/Service/appointment.js";
import vehicleRoutes from "./routes/Import/vehicle.routes.js";
import customerRequestRoutes from "./routes/Import/customerRequest.routes.js";
import financeRoutes from "./routes/Finance/finance.js";
import balanceSheetRoutes from './routes/Finance/balanceSheetRoutes.js';
import bankBookRoutes from './routes/Finance/bankBookRoutes.js';
import profitLossRoutes from './routes/Finance/profitLossRoutes.js';
import pettyCashRoutes from './routes/Finance/pettyCashRoutes.js';
import paymentRoutes from './routes/Finance/paymentRoutes.js';
import bankAccountRoutes from './routes/Finance/bankAccountRoutes.js';
import pdfRoutes from "./routes/Finance/pdfRoutes.js";
import sparePartRoutes from "./routes/Inventory/productRoute.js";

// NEW: filesystem and path utilities for uploads
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();

// Get current directory (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Fallback route for file requests
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

// Configure CORS
import cors from "cors";
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parsing
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// Authentication middleware
app.use((req, res, next) => {
  const publicRoutes = [
    "/api/employees/login",
    "/api/employees/request-otp",
    "/api/employees/verify-otp",
    "/api/employees/reset-password",
    "/api/appointments"
  ];
  if (publicRoutes.includes(req.originalUrl)) return next();

  let token = req.header("Authorization");
  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.jwt, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization token required" });
  }
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
if (!mongoUri) {
  console.error('MongoDB URI not defined');
  process.exit(1);
}
mongoose.connect(mongoUri).then(() => console.log("MongoDB connected successfully")).catch(err => console.error(err));

// Routes
app.use("/api/employees", userRoute);
app.use("/api/leave", leaveRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/repairRequest", RepairRequestFromRoute);
app.use("/api/repairs", RepairRoute);
app.use("/api/jobCards", jobCardRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/customer-requests", customerRequestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/balance-sheet', balanceSheetRoutes);
app.use('/api/bank-book', bankBookRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/profit-loss', profitLossRoutes);
app.use('/api/pettycash', pettyCashRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/pdf', pdfRoutes);
app.use("/api/spareparts", sparePartRoutes);

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
