import { Router } from "express";
import { upload } from "../../middleware/upload";
import {
  fetchHealthEnquiries,
  addHealthEnquiry,
  editHealthEnquiry,
  removeHealthEnquiry,
  uploadHealthExcel,
} from "../../controllers/enquiries/healthController";

const router = Router();

// ✅ Get all
router.get("/health", fetchHealthEnquiries);

// ✅ Add single
router.post("/health",upload.single("uploadedFile"), addHealthEnquiry);

// ✅ Bulk via Excel
router.post("/health/bulk-excel", upload.single("file"), uploadHealthExcel);

// ✅ Update (supports file replacement)
router.put("/health/:id", upload.single("uploadedFile"), editHealthEnquiry);

// ✅ Delete
router.delete("/health/:id", removeHealthEnquiry);

export default router;
