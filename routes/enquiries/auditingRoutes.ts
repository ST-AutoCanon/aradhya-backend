import { Router } from "express";
import { upload } from "../../middleware/upload";
import {
  fetchAuditingEnquiries,
  addAuditingEnquiry,
  editAuditingEnquiry,
  removeAuditingEnquiry,
  uploadAuditingExcel,
} from "../../controllers/enquiries/auditingController";

const router = Router();

// ✅ Get all enquiries
router.get("/auditing", fetchAuditingEnquiries);

// ✅ Add single enquiry with optional file
router.post("/auditing", upload.single("uploadedFile"), addAuditingEnquiry);

// ✅ Bulk upload via Excel
router.post("/auditing/bulk-excel", upload.single("file"), uploadAuditingExcel);

// ✅ Update enquiry (supports file replacement)
router.put("/auditing/:id", upload.single("uploadedFile"), editAuditingEnquiry);

// ✅ Delete enquiry
router.delete("/auditing/:id", removeAuditingEnquiry);

export default router;
