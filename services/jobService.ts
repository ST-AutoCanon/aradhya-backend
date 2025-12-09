import Job, { IJob } from "../models/job.model";

// Get all jobs
export const getJobs = async (): Promise<IJob[]> => {
  return await Job.find().sort({ createdAt: -1 }).exec();
};

// Get job by ID
export const getJobById = async (id: string): Promise<IJob | null> => {
  return await Job.findById(id).exec();
};

// Create new job
export const createJob = async (data: Partial<IJob>): Promise<IJob> => {
  const job = new Job(data);
  return await job.save();
};

// Update job
export const updateJob = async (
  id: string,
  data: Partial<IJob>
): Promise<IJob | null> => {
  return await Job.findByIdAndUpdate(id, data, { new: true }).exec();
};

// Delete job
export const deleteJob = async (id: string): Promise<IJob | null> => {
  return await Job.findByIdAndDelete(id).exec();
};
