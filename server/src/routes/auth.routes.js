import express from "express";
import authController from "../controllers/auth.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", verifyAuth, authController.getCurrentAdmin);

export default router;
