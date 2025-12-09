import { Request, Response } from "express";
import {
  getAuditingEnquiries,
  createAuditingEnquiry,
  updateAuditingEnquiry,
  deleteAuditingEnquiry,
  bulkCreateFromExcel,
} from "../../services/enquiries/auditingService";
import fs from "fs";
import path from "path";

// ✅ Fetch all enquiries
export const fetchAuditingEnquiries = async (req: Request, res: Response) => {
  try {
    const data = await getAuditingEnquiries();
    res.status(200).json(data);
  } catch (err: any) {
    console.error("ERROR in fetchAuditingEnquiries:", err);
    res.status(500).json({ message: "Failed to fetch auditing enquiries", error: err.message || err });
  }
};

// ✅ Add single enquiry with optional file
export const addAuditingEnquiry = async (req: Request, res: Response) => {
  try {
    const payload: any = { ...req.body };

    // Handle file upload
    if (req.file) {
      payload.uploadedFile = req.file.filename;
    }

    const enquiry = await createAuditingEnquiry(payload);
    res.status(201).json(enquiry);
  } catch (err: any) {
    console.error("ERROR in addAuditingEnquiry:", err);
    res.status(500).json({ message: err.message || "Failed to add auditing enquiry" });
  }
};

// ✅ Update enquiry (supports file replacement)
export const editAuditingEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: any = { ...req.body };

    // Handle file replacement
    if (req.file) {
      const existing = await updateAuditingEnquiry(id, {}); // fetch current record
      if (existing?.uploadedFile) {
        const oldFilePath = path.join(__dirname, "../../uploads", existing.uploadedFile);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      payload.uploadedFile = req.file.filename;
    }

    const updated = await updateAuditingEnquiry(id, payload);
    if (!updated) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("ERROR in editAuditingEnquiry:", err);
    res.status(500).json({ message: "Failed to update auditing enquiry", error: err.message || err });
  }
};

// ✅ Delete enquiry (also deletes uploaded file)
export const removeAuditingEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteAuditingEnquiry(id);

    if (deleted?.uploadedFile) {
      const filePath = path.join(__dirname, "../../uploads", deleted.uploadedFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (err: any) {
    console.error("ERROR in removeAuditingEnquiry:", err);
    res.status(500).json({ message: "Failed to delete auditing enquiry", error: err.message || err });
  }
};

// ✅ Bulk upload via Excel
// export const uploadAuditingExcel = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const result = await bulkCreateFromExcel(req.file.path);

//     res.status(201).json({
//       message: `${result.insertedCount} new enquiries uploaded. ${result.skippedCount} duplicates skipped.`,
//       insertedCount: result.insertedCount,
//       skippedCount: result.skippedCount,
//       duplicates: result.duplicates,
//       data: result,
//     });
//   } catch (err: any) {
//     console.error("ERROR in uploadAuditingExcel:", err);
//     res.status(500).json({
//       message: "Failed to upload Excel",
//       error: err.message || err,
//     });
//   } finally {
//     // ✅ Always remove uploaded file after processing
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//   }
// };

export const uploadAuditingExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await bulkCreateFromExcel(req.file.path);

    res.status(201).json({
      message: `${result.insertedCount} new enquiries uploaded.`,
      insertedCount: result.insertedCount,
      data: result,
    });
  } catch (err: any) {
    console.error("ERROR in uploadAuditingExcel:", err);
    res.status(500).json({
      message: "Failed to upload Excel",
      error: err.message || err,
    });
  } finally {
    // ✅ Always remove uploaded file after processing
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
