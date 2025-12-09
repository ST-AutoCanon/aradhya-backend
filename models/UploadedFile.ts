import mongoose, { Schema, Document } from "mongoose";

export interface IUploadedFile extends Document {
  name: string;       // filename on server
  type: "image" | "video";
  url: string;        // file URL
  description?: string; // only for videos
  createdAt: Date;
}

const UploadedFileSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  description: { type: String }, // optional for images
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUploadedFile>("UploadedFile", UploadedFileSchema);
