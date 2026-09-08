import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";

import { seedAdminUser } from "./utils/seedAdminUser";
import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/fillDetails/vehicleRoutes";
import healthRoutes from "./routes/fillDetails/healthRoutes";
import booksRoutes from "./routes/fillDetails/booksStationaryRoutes";
import auditingRoutes from "./routes/fillDetails/auditingRoutes";
import enquiryRoutes from "./routes/enquiryRoutes";
import vehicleRoutes1 from "./routes/enquiries/vehicleRoutes";
import healthRoutes1 from "./routes/enquiries/healthRoutes";
import auditingRoutes1 from "./routes/enquiries/auditingRoutes";
import booksStationaryRoutes1 from "./routes/enquiries/booksStationaryRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { sendMail } from "./utils/mailer";
import emailRoutes from "./routes/emailRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import excelTemplatesRoutes from "./routes/excelTemplatesRoutes";
import jobRoutes from "./routes/jobRoutes";
import jobApplicationRoutes from "./routes/jobApplicationRoutes";
import policyRoutes from "./routes/policyInfoRoutes";
import policyNotificationConfigRoutes from "./routes/policyNotificationConfigRoutes";
import cookieParser from "cookie-parser";

import policyExpiryTestRoutes from "./routes/policyExpiryTestRoutes";

import { startPolicyExpiryCron } from "./cron/policyExpiryCron";

const app = express();
connectDB();
seedAdminUser();
   
startPolicyExpiryCron();


const allowedOrigins = [
  "https://dakseyu.info",
  "https://www.dakseyu.info",
  "http://localhost:1573"
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());





// Serve uploaded files

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploaded_files", express.static(path.join(__dirname, "../uploaded_files")));
app.use("/uploaded_files", express.static(path.join(__dirname, "uploaded_files")));
app.use("/uploads/resumes", express.static(path.join(__dirname, "../uploads/resumes")));




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fillDetails/vehicle", vehicleRoutes);
app.use("/api/fillDetails/health", healthRoutes);
app.use("/api/fillDetails/booksStationary", booksRoutes);
app.use("/api/fillDetails/auditing", auditingRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/enquiries", vehicleRoutes1);
app.use("/api/enquiries", healthRoutes1);
app.use("/api/enquiries", auditingRoutes1);
app.use("/api/enquiries", booksStationaryRoutes1);
app.use("/api/uploaded_files", uploadRoutes);
app.use("/api/send-email", emailRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/excel", excelTemplatesRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/policies", policyRoutes);

app.use(
  "/api/admin/policy-expiry",
  policyExpiryTestRoutes
);

app.use(
  "/api/policy-notification-configs",
  policyNotificationConfigRoutes
);

// const PORT = process.env.PORT || 5009;
// app.listen(PORT, () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));

const PORT = 5009;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});