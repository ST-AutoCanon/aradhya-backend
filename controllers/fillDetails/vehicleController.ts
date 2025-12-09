import { Request, Response } from "express";
import { saveVehicleDetails } from "../../services/fillDetails/vehicleService";

/**
 * @desc Create Vehicle Details
 * @route POST /api/fillDetails/vehicle
 * @access Public
 */
export const createVehicleDetails = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Required fields check
    if (!data.fullName || !data.email || !data.phone || !data.mainService || !data.subService) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If file uploaded, attach filename
    if (req.file) {
      data.uploadedFile = req.file.filename;
    }

    const newVehicle = await saveVehicleDetails(data);

    res.status(201).json({ message: "Vehicle details saved successfully", data: newVehicle });
  } catch (err) {
    console.error("Error in createVehicleDetails:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
