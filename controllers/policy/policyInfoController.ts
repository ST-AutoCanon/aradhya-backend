import { Request, Response } from "express";
import {
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  activatePolicy,
  deactivatePolicy,
} from "../../services/policy/policyInfoService";

export const createPolicyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await createPolicy(req.body);

    res.status(201).json({
      success: true,
      message: "Policy created successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAllPoliciesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policies = await getAllPolicies();

    res.status(200).json({
      success: true,
      message: "Policies fetched successfully",
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policies",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getPolicyByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await getPolicyById(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: "Policy not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Policy fetched successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updatePolicyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await updatePolicy(id, req.body);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: "Policy not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deletePolicyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await deletePolicy(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: "Policy not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Policy deleted successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const activatePolicyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await activatePolicy(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: "Policy not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Policy activated successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to activate policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deactivatePolicyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await deactivatePolicy(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: "Policy not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Policy deactivated successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate policy",
      error: error instanceof Error ? error.message : error,
    });
  }
};