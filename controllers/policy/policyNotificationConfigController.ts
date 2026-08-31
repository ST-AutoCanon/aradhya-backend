
import { Request, Response } from "express";

import {
  createNotificationConfig,
  getNotificationConfigs,
  getActiveNotificationConfigs,
  getNotificationConfigById,
  updateNotificationConfig,
  deleteNotificationConfig,
  toggleNotificationConfig,
} from "../../services/policy/policyNotificationConfigService";

/**
 * ================================
 * CREATE
 * ================================
 *
 * POST
 * /admin/policy-notification-config
 */
export const createNotificationConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const config =
        await createNotificationConfig(
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Notification configuration created successfully.",
        data: config,
      });
    } catch (error: any) {
      console.error(
        "Create notification config error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to create notification configuration.",
      });
    }
  };

/**
 * ================================
 * GET ALL
 * ================================
 *
 * GET
 * /admin/policy-notification-config
 */
export const getNotificationConfigsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const configs =
        await getNotificationConfigs();

      res.status(200).json({
        success: true,
        data: configs,
      });
    } catch (error: any) {
      console.error(
        "Get notification configs error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to fetch notification configurations.",
      });
    }
  };

/**
 * ================================
 * GET ACTIVE
 * ================================
 *
 * GET
 * /admin/policy-notification-config/active
 */
export const getActiveNotificationConfigsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const configs =
        await getActiveNotificationConfigs();

      res.status(200).json({
        success: true,
        data: configs,
      });
    } catch (error: any) {
      console.error(
        "Get active notification configs error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to fetch active notification configurations.",
      });
    }
  };

/**
 * ================================
 * GET BY ID
 * ================================
 *
 * GET
 * /admin/policy-notification-config/:id
 */
export const getNotificationConfigByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        id,
      } = req.params;

      const config =
        await getNotificationConfigById(
          id
        );

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error: any) {
      console.error(
        "Get notification config error:",
        error
      );

      const status =
        error?.message ===
        "Notification configuration not found."
          ? 404
          : 400;

      res.status(status).json({
        success: false,
        message:
          error?.message ||
          "Failed to fetch notification configuration.",
      });
    }
  };

/**
 * ================================
 * UPDATE
 * ================================
 *
 * PUT
 * /admin/policy-notification-config/:id
 */
export const updateNotificationConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        id,
      } = req.params;

      const config =
        await updateNotificationConfig(
          id,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Notification configuration updated successfully.",
        data: config,
      });
    } catch (error: any) {
      console.error(
        "Update notification config error:",
        error
      );

      const status =
        error?.message ===
        "Notification configuration not found."
          ? 404
          : 400;

      res.status(status).json({
        success: false,
        message:
          error?.message ||
          "Failed to update notification configuration.",
      });
    }
  };

/**
 * ================================
 * DELETE
 * ================================
 *
 * DELETE
 * /admin/policy-notification-config/:id
 */
export const deleteNotificationConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        id,
      } = req.params;

      await deleteNotificationConfig(
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Notification configuration deleted successfully.",
      });
    } catch (error: any) {
      console.error(
        "Delete notification config error:",
        error
      );

      const status =
        error?.message ===
        "Notification configuration not found."
          ? 404
          : 400;

      res.status(status).json({
        success: false,
        message:
          error?.message ||
          "Failed to delete notification configuration.",
      });
    }
  };

/**
 * ================================
 * ENABLE / DISABLE
 * ================================
 *
 * PATCH
 * /admin/policy-notification-config/:id/toggle
 *
 * Body:
 *
 * {
 *   "enabled": true
 * }
 */
export const toggleNotificationConfigController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        id,
      } = req.params;

      const {
        enabled,
      } = req.body;

      if (
        typeof enabled !==
        "boolean"
      ) {
        res.status(400).json({
          success: false,
          message:
            "enabled must be a boolean.",
        });

        return;
      }

      const config =
        await toggleNotificationConfig(
          id,
          enabled
        );

      res.status(200).json({
        success: true,
        message: enabled
          ? "Notification configuration enabled successfully."
          : "Notification configuration disabled successfully.",
        data: config,
      });
    } catch (error: any) {
      console.error(
        "Toggle notification config error:",
        error
      );

      const status =
        error?.message ===
        "Notification configuration not found."
          ? 404
          : 400;

      res.status(status).json({
        success: false,
        message:
          error?.message ||
          "Failed to update notification configuration.",
      });
    }
  };

