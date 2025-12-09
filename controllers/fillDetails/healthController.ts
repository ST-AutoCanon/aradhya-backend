import { Request, Response } from "express";
import { saveHealthDetails } from "../../services/fillDetails/healthService";

/**
 * @desc Create Health Details
 * @route POST /api/fillDetails/health
 * @access Public
 */
export const createHealthDetails = async (req: Request, res: Response) => {
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

    const newHealth = await saveHealthDetails(data);

    res.status(201).json({ message: "Health details saved successfully", data: newHealth });
  } catch (err) {
    console.error("Error in createHealthDetails:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
