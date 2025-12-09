import JobApplication, { IJobApplication } from "../models/jobApplicationModel";

// Create a new application
export const createApplication = async (data: Partial<IJobApplication>) => {
  try {
    const application = new JobApplication(data);
    return await application.save();
  } catch (error) {
    throw new Error("Failed to create job application");
  }
};

// Get all applications (admin view)
export const getApplications = async () => {
  try {
    return await JobApplication.find()
      .populate("jobId", "title location type")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch job applications");
  }
};

// Get applications for a specific job
export const getApplicationsByJob = async (jobId: string) => {
  try {
    return await JobApplication.find({ jobId })
      .populate("jobId", "title location type")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch applications for this job");
  }
};

// Update application status
export const updateApplicationStatus = async (id: string, status: string) => {
  try {
    const updated = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      throw new Error("Application not found");
    }

    return updated;
  } catch (error) {
    throw new Error("Failed to update application status");
  }
};

// Delete single application
export const deleteApplication = async (id: string) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Application not found");
    }
    return deleted;
  } catch (error) {
    throw new Error("Failed to delete application");
  }
};

// Delete multiple applications
export const deleteMultipleApplications = async (ids: string[]) => {
  try {
    return await JobApplication.deleteMany({ _id: { $in: ids } });
  } catch (error) {
    throw new Error("Failed to delete multiple applications");
  }
};
