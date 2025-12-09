import { Request, Response } from "express";
import { saveAuditingDetails } from "../../services/fillDetails/auditingService";

/**
 * @desc Create Auditing Details
 * @route POST /api/fillDetails/auditing
 * @access Public
 */
export const createAuditingDetails = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Required fields validation
    if (!data.fullName || !data.email || !data.phone || !data.mainService || !data.subService) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Attach uploaded file if exists
    if (req.file) {
      data.uploadedFile = req.file.filename;
    }

    const newAuditing = await saveAuditingDetails(data);

    res.status(201).json({ message: "Auditing details saved successfully", data: newAuditing });
  } catch (err) {
    console.error("Error in createAuditingDetails:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
