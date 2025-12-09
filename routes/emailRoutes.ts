import express from "express";
import multer from "multer";
import { sendSingleEmail, sendBulkEmail, uploadSignature, deleteSignature,getSignature } from "../controllers/emailController";

const router = express.Router();

// Multer for email attachments
const uploadAttachments = multer({ dest: "uploads/" });

// Multer for signature upload (memory storage)
const memoryStorage = multer.memoryStorage();
const uploadSignatureFile = multer({ storage: memoryStorage });

// ===============================
// 📧 Email Routes
// ===============================
router.post("/single", uploadAttachments.array("attachments"), sendSingleEmail);
router.post("/bulk", uploadAttachments.array("attachments"), sendBulkEmail);

// ===============================
// 🖼️ Signature Management
// ===============================
router.post("/upload-signature", uploadSignatureFile.single("signature"), uploadSignature);
router.delete("/delete-signature", deleteSignature);


// routes/emailRoutes.ts
router.get("/get-signature", getSignature);


export default router;
