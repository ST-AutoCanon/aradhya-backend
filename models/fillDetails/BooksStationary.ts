import mongoose, { Schema, Document } from "mongoose";

export interface IBooksStationary extends Document {
  fullName: string;
  email: string;
  phone: string;
  schoolName?: string;
  address?: string;
  mainService: string;
  subService: string;
  uploadedFile?: string;
}

const BooksStationarySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    schoolName: { type: String },
    address: { type: String },
    mainService: { type: String, required: true },
    subService: { type: String, required: true },
    uploadedFile: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBooksStationary>("BooksStationary", BooksStationarySchema);
