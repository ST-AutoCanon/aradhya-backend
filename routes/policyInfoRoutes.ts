import { Router } from "express";

import {
  createPolicyController,
  getAllPoliciesController,
  getPolicyByIdController,
  updatePolicyController,
  deletePolicyController,
  activatePolicyController,
  deactivatePolicyController,
} from "../controllers/policy/policyInfoController";

import { importPoliciesController } from "../controllers/policy/policyImportController";
import { upload } from "../middleware/upload";
import { generatePolicyExcelTemplate } from "../utils/policyExcelTemplate";

const router = Router();

// ==========================================
// CREATE POLICY MANUALLY
// ==========================================
router.post("/", createPolicyController);

// ==========================================
// DOWNLOAD EXCEL TEMPLATE
// ==========================================
router.get("/template", (req, res) => {
  try {
    const buffer = generatePolicyExcelTemplate();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="policy-import-template.xlsx"'
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate Excel template",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// ==========================================
// IMPORT POLICIES FROM EXCEL
// ==========================================
router.post(
  "/import",
  upload.single("file"),
  importPoliciesController
);

// ==========================================
// GET ALL POLICIES
// ==========================================
router.get("/", getAllPoliciesController);

// ==========================================
// GET POLICY BY ID
// ==========================================
router.get("/:id", getPolicyByIdController);

// ==========================================
// UPDATE POLICY
// ==========================================
router.put("/:id", updatePolicyController);

// ==========================================
// DELETE POLICY
// ==========================================
router.delete("/:id", deletePolicyController);

// ==========================================
// ACTIVATE POLICY
// ==========================================
router.patch("/:id/activate", activatePolicyController);

// ==========================================
// DEACTIVATE POLICY
// ==========================================
router.patch("/:id/deactivate", deactivatePolicyController);

export default router;