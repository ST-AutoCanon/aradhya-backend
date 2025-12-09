import mongoose, { Schema, Document } from "mongoose";

export interface IAuditing extends Document {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  turnover?: string;
  yearEstablished?: string;
  mainService: string;
  subService: string;
  bookAppointment?: boolean;
  uploadedFile?: string;
}

const AuditingSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    turnover: { type: String },
    yearEstablished: { type: String },
    mainService: { type: String, required: true },
    subService: { type: String, required: true },
    bookAppointment: { type: Boolean, default: false },
    uploadedFile: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditing>("Auditing", AuditingSchema);
