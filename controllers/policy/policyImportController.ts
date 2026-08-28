import { Request, Response } from "express";
import { importPoliciesFromExcel } from "../../services/policy/policyImportService";

export const importPoliciesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });

      return;
    }

    const filePath = req.file.path;

    const result = await importPoliciesFromExcel(filePath);

    res.status(200).json({
      success: true,
      message: "Excel import completed",
      data: result,
    });
  } catch (error) {
    console.error("Excel import error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to import policies",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};