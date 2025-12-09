import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  location: string;
  type: string;
  description: string;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
