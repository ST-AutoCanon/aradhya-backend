import { Router } from "express";
import multer from "multer";
import { createBooksStationaryDetails, getBooksStationaryDetails } from "../../controllers/fillDetails/booksStationaryController";

const router = Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST → create entry
router.post("/", upload.single("file"), createBooksStationaryDetails);

// GET → fetch all entries
router.get("/", getBooksStationaryDetails);

export default router;
