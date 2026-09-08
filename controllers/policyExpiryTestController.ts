
// src/controllers/policyExpiryTestController.ts

import { Request, Response } from "express";

/**
 * In-memory test date.
 *
 * null = use the real current date.
 */
let policyExpiryTestDate: string | null = null;

/**
 * Set test date
 *
 * POST /admin/policy-expiry/test-date
 *
 * Body:
 * {
 *   "testDate": "2026-02-01"
 * }
 *
 * To reset:
 * {
 *   "testDate": null
 * }
 */
export const setPolicyExpiryTestDate = (
  req: Request,
  res: Response
) => {
  try {
    const { testDate } = req.body;

    // Reset test date
    if (testDate === null) {
      policyExpiryTestDate = null;

      return res.status(200).json({
        success: true,
        message:
          "Policy expiry test date reset. Real current date will be used.",
        testDate: null,
      });
    }

    // Validate date format
    if (
      typeof testDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(testDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "testDate must be in YYYY-MM-DD format.",
      });
    }

    // Validate actual calendar date
    const parsedDate = new Date(`${testDate}T00:00:00+05:30`);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid test date.",
      });
    }

    policyExpiryTestDate = testDate;

    return res.status(200).json({
      success: true,
      message:
        "Policy expiry test date updated successfully.",
      testDate: policyExpiryTestDate,
    });
  } catch (error) {
    console.error(
      "❌ Failed to set policy expiry test date:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to set policy expiry test date.",
    });
  }
};

/**
 * Get current configured test date.
 *
 * GET /admin/policy-expiry/test-date
 */
export const getPolicyExpiryTestDate = (
  req: Request,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    testDate: policyExpiryTestDate,
    usingRealDate: policyExpiryTestDate === null,
  });
};

/**
 * Used by the cron.
 *
 * Do not expose this through an API.
 */
export const getCurrentPolicyExpiryTestDate = () => {
  return policyExpiryTestDate;
};

