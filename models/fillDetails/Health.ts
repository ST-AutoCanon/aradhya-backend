import mongoose, { Schema, Document } from "mongoose";

export interface IHealth extends Document {
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  location?: string;
  occupation?: string;
  annualIncome?: number;
  familyMembers?: number;
  mainService: string;
  subService: string;
  uploadedFile?: string; // new field
}

const HealthSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: String },
    location: { type: String },
    occupation: { type: String },
    annualIncome: { type: Number },
    familyMembers: { type: Number },
    mainService: { type: String, required: true },
    subService: { type: String, required: true },
    uploadedFile: { type: String }, // store filename
  },
  { timestamps: true }
);

export default mongoose.model<IHealth>("Health", HealthSchema);
