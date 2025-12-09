import { Router } from "express";
import * as jobAppController from "../controllers/jobApplicationController";

const router = Router();

/* ------------------------ USER SIDE ------------------------ */
// Apply to a job
router.post("/", jobAppController.applyJob);

/* ------------------------ ADMIN SIDE ------------------------ */
// Get all applications
router.get("/", jobAppController.getAllApplications);

// Get applications by specific job ID
router.get("/job/:jobId", jobAppController.getApplicationsByJobId);

// Update application status (pending / reviewed / shortlisted / rejected)
router.patch("/:id/status", jobAppController.updateApplicationStatus);

// Delete single application
router.delete("/:id", jobAppController.deleteApplication);

// Delete multiple applications (admin bulk delete)
router.post("/delete-multiple", jobAppController.deleteMultipleApplications);

export default router;
