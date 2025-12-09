import { Request, Response } from "express";
import * as jobService from "../services/jobService";

// GET all jobs
export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await jobService.getJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err });
  }
};

// GET job by id
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err });
  }
};

// POST create job
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err });
  }
};

// PUT update job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const updated = await jobService.updateJob(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Job not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err });
  }
};

// DELETE job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const deleted = await jobService.deleteJob(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err });
  }
};
