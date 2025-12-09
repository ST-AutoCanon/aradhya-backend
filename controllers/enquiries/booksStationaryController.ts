//28-10-2025
import { Request, Response } from "express";
import {
  getBooksStationaryEnquiries,
  createBooksStationaryEnquiry,
  updateBooksStationaryEnquiry,
  deleteBooksStationaryEnquiry,
  bulkCreateBooksStationaryFromExcel,
} from "../../services/enquiries/booksStationaryService";
import fs from "fs";
import path from "path";

// ✅ Fetch all enquiries
export const fetchBooksStationaryEnquiries = async (req: Request, res: Response) => {
  try {
    const data = await getBooksStationaryEnquiries();
    res.status(200).json(data);
  } catch (err: any) {
    console.error("ERROR in fetchBooksStationaryEnquiries:", err);
    res.status(500).json({
      message: "Failed to fetch books & stationary enquiries",
      error: err.message || err,
    });
  }
};

// ✅ Add single enquiry
export const addBooksStationaryEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiryData = { ...req.body };

    if (req.file) {
      enquiryData.uploadedFile = req.file.filename;
    }

    const enquiry = await createBooksStationaryEnquiry(enquiryData);
    res.status(201).json(enquiry);
  } catch (err: any) {
    console.error("ERROR in addBooksStationaryEnquiry:", err);
    res.status(500).json({
      message: "Failed to add enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Update enquiry (supports file replacement)
export const editBooksStationaryEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: any = { ...req.body };

    if (req.file) {
      const existing = await updateBooksStationaryEnquiry(id, {}); // temporary fetch
      if (existing?.uploadedFile) {
        const oldFilePath = path.join(__dirname, "../../uploads", existing.uploadedFile);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      payload.uploadedFile = req.file.filename;
    }

    const updated = await updateBooksStationaryEnquiry(id, payload);
    if (!updated) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("ERROR in editBooksStationaryEnquiry:", err);
    res.status(500).json({
      message: "Failed to update enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Delete enquiry (also deletes uploaded file)
export const removeBooksStationaryEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBooksStationaryEnquiry(id);

    if (deleted?.uploadedFile) {
      const filePath = path.join(__dirname, "../../uploads", deleted.uploadedFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (err: any) {
    console.error("ERROR in removeBooksStationaryEnquiry:", err);
    res.status(500).json({
      message: "Failed to delete enquiry",
      error: err.message || err,
    });
  }
};

// ✅ Bulk upload via Excel (skips duplicates, reports summary)
// export const uploadBooksStationaryExcel = async (req: Request, res: Response) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const result = await bulkCreateBooksStationaryFromExcel(req.file.path);

//     res.status(201).json({
//       message: result.message,
//       insertedCount: result.insertedCount,
//       skippedCount: result.skippedCount,
//       duplicates: result.duplicates,
//       data: result,
//     });
//   } catch (err: any) {
//     console.error("ERROR in uploadBooksStationaryExcel:", err);
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

export const uploadBooksStationaryExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await bulkCreateBooksStationaryFromExcel(req.file.path);

    res.status(201).json({
      message: result.message,
      insertedCount: result.insertedCount,
      data: result,
    });
  } catch (err: any) {
    console.error("ERROR in uploadBooksStationaryExcel:", err);
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
