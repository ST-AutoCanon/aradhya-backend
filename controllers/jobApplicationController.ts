import { Request, Response } from "express";
import multer from "multer";
import * as jobAppService from "../services/jobApplicationService";
import Job from "../models/job.model";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("resume");

// Apply for a job
export const applyJob = (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: err });
    }

    try {
      const { jobId, fullName, email, phone, qualification, experience, comments } = req.body;

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const applicationData = {
        jobId,
        jobTitle: job.title,
        fullName,
        email,
        phone,
        qualification,
        experience,
        comments,
        resume: req.file?.filename,
      };

      const application = await jobAppService.createApplication(applicationData);
      res.status(201).json(application);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error applying for job", error: err });
    }
  });
};

// Get all applications (admin)
export const getAllApplications = async (_req: Request, res: Response) => {
  try {
    const applications = await jobAppService.getApplications();
    res.json(applications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err });
  }
};

// Get applications by job
export const getApplicationsByJobId = async (req: Request, res: Response) => {
  try {
    const applications = await jobAppService.getApplicationsByJob(
      req.params.jobId
    );
    res.json(applications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err });
  }
};

// Update status (pending → reviewed → shortlisted → rejected)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await jobAppService.updateApplicationStatus(
      req.params.id,
      status
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Error updating application status",
      error: err,
    });
  }
};

// Delete single application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const deleted = await jobAppService.deleteApplication(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting application",
      error: err,
    });
  }
};

// Delete multiple applications
export const deleteMultipleApplications = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // array of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No application IDs provided" });
    }

    await jobAppService.deleteMultipleApplications(ids);

    res.json({ message: "Selected applications deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting applications",
      error: err,
    });
  }
};
