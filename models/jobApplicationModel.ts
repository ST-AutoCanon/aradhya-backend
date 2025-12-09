import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  jobId: string;
  jobTitle: string; // added jobTitle
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  education: string;
  experience: number;
  resume?: string; // path to uploaded file
  comments?: string;
  status: string;
  createdAt: Date;
}

const jobApplicationSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    jobTitle: { type: String, required: true }, // added jobTitle
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    qualification: { type: String },
    experience: { type: Number },
    resume: { type: String },
    comments: { type: String },
     status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;
