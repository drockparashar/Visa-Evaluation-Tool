import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import ApiKey from "../models/ApiKey.js";

/**
 * Middleware to validate API key from X-API-Key header
 */
export const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // Allow requests without API key for now (MVP - can be made required later)
    if (!apiKey) {
      // Mark as web request
      req.apiKeyValidated = false;
      req.requestSource = "web";
      return next();
    }

    // Extract keyId and secret from the API key
    // Format: veval_keyId_secret
    const parts = apiKey.split("_");
    if (parts.length !== 3 || parts[0] !== "veval") {
      return res.status(401).json({
        success: false,
        message: "Invalid API key format",
      });
    }

    const keyId = parts[1];
    const secret = parts[2];

    // Find API key in database
    const apiKeyDoc = await ApiKey.findOne({ keyId, isActive: true });

    if (!apiKeyDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive API key",
      });
    }

    // Check expiration
    if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "API key has expired",
      });
    }

    // Verify secret
    const isValid = await bcrypt.compare(secret, apiKeyDoc.keyHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key",
      });
    }

    // Check rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requestsToday = await mongoose.model("Evaluation").countDocuments({
      apiKeyId: apiKeyDoc._id,
      createdAt: { $gte: today },
    });

    if (requestsToday >= apiKeyDoc.rateLimit.requestsPerDay) {
      return res.status(429).json({
        success: false,
        message: "API key rate limit exceeded. Please try again tomorrow.",
      });
    }

    // Update usage
    apiKeyDoc.usage.totalRequests += 1;
    apiKeyDoc.usage.lastUsedAt = new Date();
    await apiKeyDoc.save();

    // Attach API key info to request
    req.apiKeyValidated = true;
    req.apiKeyId = apiKeyDoc._id;
    req.apiKeyInfo = {
      keyId: apiKeyDoc.keyId,
      name: apiKeyDoc.name,
      partner: apiKeyDoc.partnerInfo,
    };
    req.requestSource = "api";

    next();
  } catch (error) {
    console.error("API key validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating API key",
    });
  }
};

/**
 * Middleware to require API key (strict mode)
 */
export const requireApiKey = (req, res, next) => {
  if (!req.apiKeyValidated) {
    return res.status(401).json({
      success: false,
      message: "API key required. Please provide X-API-Key header.",
    });
  }
  next();
};

export default { validateApiKey, requireApiKey };
