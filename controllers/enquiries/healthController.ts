//28-10-2025
import { Request, Response } from "express";
import {
  getHealthEnquiries,
  createHealthEnquiry,
  updateHealthEnquiry,
  deleteHealthEnquiry,
  bulkCreateHealthFromExcel,
} from "../../services/enquiries/healthService";
import fs from "fs";
import path from "path";

// ✅ Fetch all health enquiries
export const fetchHealthEnquiries = async (req: Request, res: Response) => {
  try {
    const data = await getHealthEnquiries();
    res.status(200).json(data);
  } catch (err: any) {
    console.error("ERROR in fetchHealthEnquiries:", err);
    res.status(500).json({
      message: "Failed to fetch health enquiries",
      error: err.message || err,
    });
  }
};

// ✅ Add single health enquiry (supports file upload)
export const addHealthEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiryData = { ...req.body };

    if (req.file) {
      enquiryData.uploadedFile = req.file.filename;
    }

    const enquiry = await createHealthEnquiry(enquiryData);
    res.status(201).json(enquiry);
  } catch (err: any) {
    console.error("ERROR in addHealthEnquiry:", err);
    res.status(500).json({ message: err.message || "Failed to add HealthEnquiry enquiry" });

  }
};

// ✅ Update health enquiry (supports file replacement)
export const editHealthEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: any = { ...req.body };

    if (req.file) {
      const existing = await updateHealthEnquiry(id, {}); // temporary fetch
      if (existing?.uploadedFile) {
        const oldFilePath = path.join(__dirname, "../../uploads", existing.uploadedFile);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      payload.uploadedFile = req.file.filename;
    }

    const updated = await updateHealthEnquiry(id, payload);
    if (!updated) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("ERROR in editHealthEnquiry:", err);
    res.status(500).json({
      message: "Failed to update health enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Delete health enquiry (also deletes uploaded file)
export const removeHealthEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteHealthEnquiry(id);

    if (deleted?.uploadedFile) {
      const filePath = path.join(__dirname, "../../uploads", deleted.uploadedFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (err: any) {
    console.error("ERROR in removeHealthEnquiry:", err);
    res.status(500).json({
      message: "Failed to delete health enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Bulk upload via Excel (skips duplicates, returns summary)
// export const uploadHealthExcel = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const result = await bulkCreateHealthFromExcel(req.file.path);

//     res.status(201).json({
//       message: result.message,
//       insertedCount: result.insertedCount,
//       skippedCount: result.skippedCount,
//       duplicates: result.duplicates,
//       data: result,
//     });
//   } catch (err: any) {
//     console.error("ERROR in uploadHealthExcel:", err);
//     res.status(500).json({
//       message: "Failed to upload Excel",
//       error: err.message || err,
//     });
//   } finally {
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//   }
// };


export const uploadHealthExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await bulkCreateHealthFromExcel(req.file.path);

    res.status(201).json({
      message: result.message,
      insertedCount: result.insertedCount,
      data: result,
    });
  } catch (err: any) {
    console.error("ERROR in uploadHealthExcel:", err);
    res.status(500).json({
      message: "Failed to upload Excel",
      error: err.message || err,
    });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
