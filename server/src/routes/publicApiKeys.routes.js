import express from "express";
import publicApiKeysController from "../controllers/publicApiKeys.controller.js";

const router = express.Router();

// Public API key request (no auth required)
router.post("/request", publicApiKeysController.requestApiKey);

// Verify email and create key
router.post("/verify/:token", publicApiKeysController.verifyAndCreateKey);

export default router;
