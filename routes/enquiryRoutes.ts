import { Router } from "express";
import { getEnquiries } from "../controllers/enquiryController";

const router = Router();

router.get("/enquiries", getEnquiries);

export default router;
