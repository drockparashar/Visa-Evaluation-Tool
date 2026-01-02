import crypto from "crypto";
import bcrypt from "bcryptjs";
import ApiKey from "../models/ApiKey.js";

class ApiKeyService {
  /**
   * Generate a new API key
   */
  generateApiKey() {
    const keyId = crypto.randomBytes(8).toString("hex");
    const secret = crypto.randomBytes(24).toString("hex");
    const apiKey = `veval_${keyId}_${secret}`;
    return { keyId, secret, apiKey };
  }

  /**
   * Create a new API key
   */
  async createApiKey(data) {
    const { keyId, secret, apiKey } = this.generateApiKey();

    // Hash the secret
    const salt = await bcrypt.genSalt(10);
    const keyHash = await bcrypt.hash(secret, salt);

    const apiKeyDoc = new ApiKey({
      keyId,
      keyHash,
      name: data.name,
      partnerInfo: {
        name: data.partnerName,
        email: data.partnerEmail,
        organization: data.organization,
      },
      rateLimit: {
        requestsPerDay: data.requestsPerDay || 100,
      },
      expiresAt: data.expiresAt || null,
    });

    await apiKeyDoc.save();

    return {
      ...apiKeyDoc.toObject(),
      apiKey, // Only return the full key once on creation
    };
  }

  /**
   * Get all API keys (without secrets)
   */
  async getAllApiKeys() {
    return ApiKey.find().select("-keyHash").sort({ createdAt: -1 });
  }

  /**
   * Get API key by ID
   */
  async getApiKeyById(keyId) {
    return ApiKey.findOne({ keyId }).select("-keyHash");
  }

  /**
   * Update API key
   */
  async updateApiKey(keyId, updates) {
    const allowedUpdates = [
      "name",
      "isActive",
      "rateLimit",
      "expiresAt",
      "partnerInfo",
    ];
    const filteredUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    return ApiKey.findOneAndUpdate({ keyId }, filteredUpdates, { new: true });
  }

  /**
   * Revoke (deactivate) API key
   */
  async revokeApiKey(keyId) {
    return ApiKey.findOneAndUpdate(
      { keyId },
      { isActive: false },
      { new: true }
    );
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(keyId) {
    const apiKey = await ApiKey.findOne({ keyId });
    if (!apiKey) {
      throw new Error("API key not found");
    }

    const mongoose = await import("mongoose");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requestsToday = await mongoose.model("Evaluation").countDocuments({
      apiKeyId: apiKey._id,
      createdAt: { $gte: today },
    });

    return {
      totalRequests: apiKey.usage.totalRequests,
      requestsToday,
      lastUsedAt: apiKey.usage.lastUsedAt,
      rateLimit: apiKey.rateLimit.requestsPerDay,
      remainingToday: Math.max(
        0,
        apiKey.rateLimit.requestsPerDay - requestsToday
      ),
    };
  }
}

export default new ApiKeyService();
