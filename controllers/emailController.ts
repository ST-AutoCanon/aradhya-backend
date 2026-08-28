// controllers/emailController.ts
import { Request, Response } from "express";
import { sendMail, EmailAttachment } from "../services/messaging/emailService";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB total

// ===============================
// 📧 Single Email
// ===============================
export const sendSingleEmail = async (req: Request, res: Response) => {
  const { to, subject, text, html } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const attachments: EmailAttachment[] | undefined = files?.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Validate attachment sizes
    if (attachments) {
      let totalSize = 0;
      for (const file of attachments) {
        const fileSize = files!.find(f => f.originalname === file.filename)?.size || 0;
        if (fileSize > MAX_FILE_SIZE) {
          return res.status(400).json({ message: `${file.filename} exceeds 20 MB per file limit.` });
        }
        totalSize += fileSize;
      }
      if (totalSize > MAX_TOTAL_SIZE) {
        return res.status(400).json({ message: `Total attachments exceed 20 MB limit.` });
      }
    }

    const info = await sendMail(to, subject, text, html, attachments);
    res.json({ message: "Email sent successfully", info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email", error: err });
  }
};

// ===============================
// 📧 Bulk Email
// ===============================
export const sendBulkEmail = async (req: Request, res: Response) => {
  const { recipients, subject, text, html } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: "Recipients array is required" });
  }

  try {
    const attachments: EmailAttachment[] | undefined = files?.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // Validate attachment sizes
    if (attachments) {
      let totalSize = 0;
      for (const file of attachments) {
        const fileSize = files!.find(f => f.originalname === file.filename)?.size || 0;
        if (fileSize > MAX_FILE_SIZE) {
          return res.status(400).json({ message: `${file.filename} exceeds 20 MB per file limit.` });
        }
        totalSize += fileSize;
      }
      if (totalSize > MAX_TOTAL_SIZE) {
        return res.status(400).json({ message: `Total attachments exceed 20 MB limit.` });
      }
    }

    const results = [];
    for (const email of recipients) {
      const info = await sendMail(email, subject, text, html, attachments);
      results.push({ email, info });
    }

    res.json({ message: "Bulk email sent successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending bulk email", error: err });
  }
};

// ===============================
// 🖼️ Upload Signature
// ===============================
export const uploadSignature = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const SIGNATURE_DIR = path.resolve(process.cwd(), "Signature_files");
    const SIGNATURE_PATH = path.join(SIGNATURE_DIR, "signature.png");

    if (!fs.existsSync(SIGNATURE_DIR)) {
      fs.mkdirSync(SIGNATURE_DIR, { recursive: true });
    }

    // Delete old signature if exists
    if (fs.existsSync(SIGNATURE_PATH)) {
      fs.unlinkSync(SIGNATURE_PATH);
    }

    // Save new signature
    fs.writeFileSync(SIGNATURE_PATH, req.file.buffer);

    res.json({ message: "✅ Signature uploaded successfully." });
  } catch (error) {
    console.error("❌ Error uploading signature:", error);
    res.status(500).json({ message: "Error uploading signature", error });
  }
};

// ===============================
// 🗑️ Delete Signature
// ===============================
export const deleteSignature = async (req: Request, res: Response) => {
  try {
    const SIGNATURE_PATH = path.resolve(process.cwd(), "Signature_files/signature.png");

    if (!fs.existsSync(SIGNATURE_PATH)) {
      return res.status(404).json({ message: "No signature found to delete." });
    }

    fs.unlinkSync(SIGNATURE_PATH);
    res.json({ message: "🗑️ Signature deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting signature:", error);
    res.status(500).json({ message: "Error deleting signature", error });
  }
};


// 🖼️ Get Signature Image
// ===============================
export const getSignature = async (req: Request, res: Response) => {
  try {
    const SIGNATURE_PATH = path.resolve(process.cwd(), "Signature_files/signature.png");

    if (!fs.existsSync(SIGNATURE_PATH)) {
      return res.status(404).json({ message: "No signature found." });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "image/png");
    res.sendFile(SIGNATURE_PATH);
  } catch (error) {
    console.error("❌ Error fetching signature:", error);
    res.status(500).json({ message: "Error fetching signature", error });
  }
};