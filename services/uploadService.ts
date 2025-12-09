import path from "path";
import fs from "fs";
import UploadedFile from "../models/UploadedFile";

const UPLOAD_DIR = path.join(__dirname, "../uploaded_files");

// Ensure upload folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const getNextFileName = (type: "image" | "video", ext: string) => {
  const files = fs.readdirSync(UPLOAD_DIR);

  const filtered = files.filter(f => (type === "image" ? f.startsWith("image") : f.startsWith("video")));
  return `${type}${filtered.length + 1}${ext}`;
};

/**
 * Save file to filesystem & database
 */
// export const saveFile = async (file: Express.Multer.File, description?: string) => {
//   const ext = path.extname(file.originalname);
//   const type: "image" | "video" = file.mimetype.startsWith("image") ? "image" : "video";

//   const uniqueName = getNextFileName(type, ext);
//   const filePath = path.join(UPLOAD_DIR, uniqueName);

//   // Save file to disk
//   fs.writeFileSync(filePath, file.buffer);

//   // Save metadata to DB
//   const savedFile = await UploadedFile.create({
//     name: uniqueName,
//     type,
//     url: `/uploaded_files/${uniqueName}`,
//     description: type === "video" ? description : undefined,
//   });

//   return savedFile;
// };


export const saveFile = async (file: Express.Multer.File, description?: string) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // FIX: Correct type detection using extension instead of mimetype
  const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

  let type: "image" | "video";

  if (imageExts.includes(ext)) {
    type = "image";
  } else if (videoExts.includes(ext)) {
    type = "video";
  } else {
    throw new Error("Unsupported file format");
  }

  // --- LIMIT CHECK ---
  const files = fs.readdirSync(UPLOAD_DIR);
  const filtered = files.filter(f =>
    type === "image" ? f.startsWith("image") : f.startsWith("video")
  );

  const maxImages = 20;
  const maxVideos = 10;

  if (
    (type === "image" && filtered.length >= maxImages) ||
    (type === "video" && filtered.length >= maxVideos)
  ) {
    throw new Error(`Cannot upload more than ${type === "image" ? maxImages : maxVideos} ${type}s.`);
  }
  // ------------------

  const uniqueName = getNextFileName(type, ext);
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  // Save file to disk
  fs.writeFileSync(filePath, file.buffer);

  // Save metadata to DB
  const savedFile = await UploadedFile.create({
    name: uniqueName,
    type,
    url: `/uploaded_files/${uniqueName}`,
    description: type === "video" ? description : undefined,
  });

  return savedFile;
};

/**
 * List all files from DB
 */
export const listFiles = async () => {
  return await UploadedFile.find().sort({ createdAt: -1 });
};

/**
 * Delete file from filesystem & DB
 */
export const deleteFile = async (id: string) => {
  const file = await UploadedFile.findById(id);
  if (!file) throw new Error("File not found");

  const filePath = path.join(UPLOAD_DIR, file.name);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await file.deleteOne();
};

// Delete all files from disk and database
export const deleteAllFiles = async () => {
  const files = await UploadedFile.find();

  // Delete from filesystem
  files.forEach(file => {
    const filePath = path.join(UPLOAD_DIR, file.name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  // Delete all documents in DB
  await UploadedFile.deleteMany({});
};

/**
 * Update file metadata or replace file
 */
export const updateFile = async (id: string, file?: Express.Multer.File, description?: string) => {
  const uploadedFile = await UploadedFile.findById(id);
  if (!uploadedFile) throw new Error("File not found");

  const filePath = path.join(UPLOAD_DIR, uploadedFile.name);

  // If new file is uploaded, replace old file
  if (file) {
    // Delete old file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const ext = path.extname(file.originalname);
    const type: "image" | "video" = file.mimetype.startsWith("image") ? "image" : "video";
    const uniqueName = getNextFileName(type, ext);
    const newPath = path.join(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(newPath, file.buffer);

    uploadedFile.name = uniqueName;
    uploadedFile.type = type;
    uploadedFile.url = `/uploaded_files/${uniqueName}`;
  }

  // Update description if provided
  if (description) {
    uploadedFile.description = description;
  }

  await uploadedFile.save();
  return uploadedFile;
};