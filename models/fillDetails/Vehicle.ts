import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  fullName: string;
  email: string;
  phone: string;
  vehicleNumber?: string;
  location?: string;
  mainService: string;
  subService: string;
  uploadedFile?: string;
}

const VehicleSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleNumber: { type: String },
    location: { type: String },
    mainService: { type: String, required: true },
    subService: { type: String, required: true },
    uploadedFile: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
