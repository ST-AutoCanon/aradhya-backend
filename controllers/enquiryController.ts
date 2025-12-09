import { Request, Response } from "express";
import { getEnquiriesData } from "../services/enquiryService";

export const getEnquiries = async (req: Request, res: Response) => {
  const { service } = req.query;
  if (!service || typeof service !== "string") {
    return res.status(400).json({ message: "Service is required" });
  }

  try {
    const data = await getEnquiriesData(service);
    return res.json(data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
