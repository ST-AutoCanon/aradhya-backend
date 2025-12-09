import { Router } from "express";
import { upload } from "../../middleware/upload";
import {
  fetchBooksStationaryEnquiries,
  addBooksStationaryEnquiry,
  editBooksStationaryEnquiry,
  removeBooksStationaryEnquiry,
  uploadBooksStationaryExcel,
} from "../../controllers/enquiries/booksStationaryController";

const router = Router();

// ✅ Get all
router.get("/books-stationary", fetchBooksStationaryEnquiries);

// ✅ Add single
router.post("/books-stationary", upload.single("uploadedFile"), addBooksStationaryEnquiry);

// ✅ Bulk via Excel
router.post("/books-stationary/bulk-excel", upload.single("file"), uploadBooksStationaryExcel);

// ✅ Update (supports file replacement)
router.put("/books-stationary/:id", upload.single("uploadedFile"), editBooksStationaryEnquiry);

// ✅ Delete
router.delete("/books-stationary/:id", removeBooksStationaryEnquiry);

export default router;
