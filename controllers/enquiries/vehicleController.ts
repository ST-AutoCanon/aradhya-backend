//28-10-2025
import { Request, Response } from "express";
import {
  getVehicleEnquiries,
  createVehicleEnquiry,
  updateVehicleEnquiry,
  deleteVehicleEnquiry,
  bulkCreateVehicleFromExcel,
} from "../../services/enquiries/vehicleService";
import fs from "fs";
import path from "path";

// ✅ Fetch all vehicle enquiries
export const fetchVehicleEnquiries = async (req: Request, res: Response) => {
  try {
    const data = await getVehicleEnquiries();
    res.status(200).json(data);
  } catch (err: any) {
    console.error("ERROR in fetchVehicleEnquiries:", err);
    res.status(500).json({
      message: "Failed to fetch vehicle enquiries",
      error: err.message || err,
    });
  }
};

// ✅ Add single vehicle enquiry (supports file upload)
export const addVehicleEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiryData = { ...req.body };

    if (req.file) {
      enquiryData.uploadedFile = req.file.filename;
    }

    const enquiry = await createVehicleEnquiry(enquiryData);
    res.status(201).json(enquiry);
  } catch (err: any) {
    console.error("ERROR in addVehicleEnquiry:", err);
  res.status(500).json({ message: err.message || "Failed to addVehicleEnquiry enquiry" });
  }
};

// ✅ Update vehicle enquiry (supports file replacement)
export const editVehicleEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: any = { ...req.body };

    if (req.file) {
      // Fetch existing record to delete old file if exists
      const existing = await updateVehicleEnquiry(id, {}); // fetch current record
      if (existing?.uploadedFile) {
        const oldFilePath = path.join(__dirname, "../../uploads", existing.uploadedFile);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      payload.uploadedFile = req.file.filename;
    }

    const updated = await updateVehicleEnquiry(id, payload);
    if (!updated) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("ERROR in editVehicleEnquiry:", err);
    res.status(500).json({
      message: "Failed to update vehicle enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Delete vehicle enquiry (also deletes uploaded file)
export const removeVehicleEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteVehicleEnquiry(id);

    if (deleted?.uploadedFile) {
      const filePath = path.join(__dirname, "../../uploads", deleted.uploadedFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (err: any) {
    console.error("ERROR in removeVehicleEnquiry:", err);
    res.status(500).json({
      message: "Failed to delete vehicle enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Bulk upload via Excel (skips duplicates, returns summary)
// export const uploadVehicleExcel = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const result = await bulkCreateVehicleFromExcel(req.file.path);

//     res.status(201).json({
//       message: result.message,
//       insertedCount: result.insertedCount,
//       skippedCount: result.skippedCount,
//       duplicates: result.duplicates,
//       data: result,
//     });
//   } catch (err: any) {
//     console.error("ERROR in uploadVehicleExcel:", err);
//     res.status(500).json({
//       message: "Failed to upload Excel",
//       error: err.message || err,
//     });
//   } finally {
//     // clean up uploaded file if still exists
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//   }
// };


export const uploadVehicleExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await bulkCreateVehicleFromExcel(req.file.path);

    res.status(201).json({
      message: result.message,
      insertedCount: result.insertedCount,
      data: result,
    });
  } catch (err: any) {
    console.error("ERROR in uploadVehicleExcel:", err);
    res.status(500).json({
      message: "Failed to upload Excel",
      error: err.message || err,
    });
  } finally {
    // clean up uploaded file if still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
