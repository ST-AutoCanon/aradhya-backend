import { Router } from "express";
import multer from "multer";
import path from "path";
import { createHealthDetails } from "../../controllers/fillDetails/healthController";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Accept images, PDFs, and Excel files
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedExt = /jpeg|jpg|png|pdf|xls|xlsx/;
  const ext = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mime = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ].includes(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, and Excel files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// POST /api/fillDetails/health
router.post("/", upload.single("file"), createHealthDetails);

export default router;
