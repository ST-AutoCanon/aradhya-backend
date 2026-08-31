
import { Router } from "express";

import {
  createNotificationConfigController,
  getNotificationConfigsController,
  getActiveNotificationConfigsController,
  getNotificationConfigByIdController,
  updateNotificationConfigController,
  deleteNotificationConfigController,
  toggleNotificationConfigController,
} from "../controllers/policy/policyNotificationConfigController";

const router =
  Router();

/**
 * ================================
 * CREATE
 * ================================
 *
 * POST
 * /admin/policy-notification-config
 */
router.post(
  "/",
  createNotificationConfigController
);

/**
 * ================================
 * GET ALL
 * ================================
 *
 * GET
 * /admin/policy-notification-config
 */
router.get(
  "/",
  getNotificationConfigsController
);

/**
 * ================================
 * GET ACTIVE
 * ================================
 *
 * GET
 * /admin/policy-notification-config/active
 *
 * IMPORTANT:
 * This route must be declared BEFORE
 * /:id.
 */
router.get(
  "/active",
  getActiveNotificationConfigsController
);

/**
 * ================================
 * GET BY ID
 * ================================
 *
 * GET
 * /admin/policy-notification-config/:id
 */
router.get(
  "/:id",
  getNotificationConfigByIdController
);

/**
 * ================================
 * UPDATE
 * ================================
 *
 * PUT
 * /admin/policy-notification-config/:id
 */
router.put(
  "/:id",
  updateNotificationConfigController
);

/**
 * ================================
 * DELETE
 * ================================
 *
 * DELETE
 * /admin/policy-notification-config/:id
 */
router.delete(
  "/:id",
  deleteNotificationConfigController
);

/**
 * ================================
 * ENABLE / DISABLE
 * ================================
 *
 * PATCH
 * /admin/policy-notification-config/:id/toggle
 */
router.patch(
  "/:id/toggle",
  toggleNotificationConfigController
);

export default router;
