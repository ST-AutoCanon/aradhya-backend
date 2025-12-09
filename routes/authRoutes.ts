//23-10-2025
import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;


