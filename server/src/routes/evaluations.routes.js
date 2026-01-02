import express from "express";
import evaluationsController from "../controllers/evaluations.controller.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import { validateApiKey } from "../middleware/apiKey.middleware.js";

const router = express.Router();

// Create new evaluation (with file upload and optional API key)
router.post(
  "/",
  validateApiKey,
  uploadMiddleware,
  evaluationsController.createEvaluation
);

// Get all evaluations (with filters)
router.get("/", evaluationsController.getAllEvaluations);

// Get evaluation by ID
router.get("/:id", evaluationsController.getEvaluationById);

// Download evaluation as PDF
router.get("/:id/download", evaluationsController.downloadEvaluationPDF);

// Get evaluations by user email
router.get("/user/:email", evaluationsController.getEvaluationsByEmail);

// Delete evaluation
router.delete("/:id", evaluationsController.deleteEvaluation);

export default router;
