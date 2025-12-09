import { Router } from "express";
import { getBanner, saveBanner, deleteBanner } from "../controllers/bannerController";

const router = Router();

// GET latest banner
router.get("/", getBanner);

// POST create/update latest banner
router.post("/", saveBanner);

// DELETE banner by ID
router.delete("/:id", deleteBanner);

export default router;
