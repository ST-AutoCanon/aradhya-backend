import { Request, Response } from "express";
import * as bannerService from "../services/bannerService";

export const getBanner = async (_req: Request, res: Response) => {
  try {
    const banner = await bannerService.getBanner();
    res.json({ messages: banner?.messages || [] }); // always return array    
  } catch (err) {
    res.status(500).json({ message: "Error fetching banner", error: err });
  }
};

// POST create/update latest banner
export const saveBanner = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ message: "Messages array is required" });

    const banner = await bannerService.saveBanner(messages);
    res.status(201).json(banner);    
  } catch (err) {
    res.status(500).json({ message: "Error saving banner", error: err });
  }
};

// DELETE banner by ID
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await bannerService.deleteBanner(id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner", error: err });
  }
};
