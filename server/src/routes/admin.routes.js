import express from "express";
import apiKeysController from "../controllers/apiKeys.controller.js";
import analyticsController from "../controllers/analytics.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require authentication
router.use(verifyAuth);

// API Keys Management
router.post("/api-keys", apiKeysController.createApiKey);
router.get("/api-keys", apiKeysController.getAllApiKeys);
router.get("/api-keys/:keyId", apiKeysController.getApiKeyById);
router.put("/api-keys/:keyId", apiKeysController.updateApiKey);
router.delete("/api-keys/:keyId", apiKeysController.revokeApiKey);
router.get("/api-keys/:keyId/stats", apiKeysController.getApiKeyStats);

// Analytics
router.get("/analytics/dashboard", analyticsController.getDashboardStats);
router.get("/analytics/usage", analyticsController.getUsageOverTime);
router.get("/analytics/top-keys", analyticsController.getTopApiKeys);
router.get("/analytics/countries", analyticsController.getCountryDistribution);
router.get(
  "/analytics/visa-types",
  analyticsController.getVisaTypeDistribution
);
router.get("/analytics/recent", analyticsController.getRecentActivity);

export default router;
