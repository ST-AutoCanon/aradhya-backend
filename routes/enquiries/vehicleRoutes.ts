import { Router } from "express";
import { upload } from "../../middleware/upload";
import {
  fetchVehicleEnquiries,
  addVehicleEnquiry,
  editVehicleEnquiry,
  removeVehicleEnquiry,
  uploadVehicleExcel,
} from "../../controllers/enquiries/vehicleController";

const router = Router();

// ✅ Get all
router.get("/vehicle", fetchVehicleEnquiries);

// ✅ Add single
router.post("/vehicle",upload.single("uploadedFile"), addVehicleEnquiry);

// ✅ Bulk via Excel
router.post("/vehicle/bulk-excel", upload.single("file"), uploadVehicleExcel);

// ✅ Update (supports file replacement)
router.put("/vehicle/:id", upload.single("uploadedFile"), editVehicleEnquiry);

// ✅ Delete
router.delete("/vehicle/:id", removeVehicleEnquiry);

export default router;
