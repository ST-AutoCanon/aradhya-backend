import { Request, Response } from "express";
import multer from "multer";
import { saveFile, listFiles, deleteFile, deleteAllFiles,updateFile } from "../services/uploadService";

// Configure multer to store file in memory
// export const upload = multer({ storage: multer.memoryStorage() });

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB max
  },
  fileFilter: (req, file, cb) => {
    // Optional: restrict to images or videos
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image and video files are allowed"));
    }
    cb(null, true);
  },
});
/**
 * Upload a file (image or video)
 * For videos, accept optional description in req.body.description
 */
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const description = req.body.description; // optional, only for videos
    const saved = await saveFile(req.file, description);

    res.json(saved);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
};

/**
 * Get all files from DB
 */
export const getFiles = async (req: Request, res: Response) => {
  try {
    const files = await listFiles();
    res.json(files);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to fetch files" });
  }
};

/**
 * Delete a file by ID
 */
export const removeFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteFile(id);
    res.json({ message: "File deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Delete failed" });
  }
};


export const removeAllFiles = async (req: Request, res: Response) => {
  try {
    await deleteAllFiles();
    res.json({ message: "All files deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete all files" });
  }
};

export const updateFileController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const description = req.body.description;
    const file = req.file;

    const updated = await updateFile(id, file, description);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Update failed" });
  }
};
