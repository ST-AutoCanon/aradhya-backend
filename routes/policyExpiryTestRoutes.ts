
// src/routes/policyExpiryTestRoutes.ts

import { Router } from "express";

import {
  setPolicyExpiryTestDate,
  getPolicyExpiryTestDate,
} from "../controllers/policyExpiryTestController";

const router = Router();

/**
 * Set policy expiry test date
 *
 * POST /admin/policy-expiry/test-date
 */
router.post(
  "/test-date",
  setPolicyExpiryTestDate
);

/**
 * Get current policy expiry test date
 *
 * GET /admin/policy-expiry/test-date
 */
router.get(
  "/test-date",
  getPolicyExpiryTestDate
);

export default router;

