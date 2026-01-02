import apiKeyService from "../services/apiKey.service.js";
import ApiKey from "../models/ApiKey.js";
import mongoose from "mongoose";

class ApiKeysController {
  /**
   * Create new API key
   * POST /api/admin/api-keys
   */
  async createApiKey(req, res) {
    try {
      const {
        name,
        partnerName,
        partnerEmail,
        organization,
        requestsPerDay,
        expiresAt,
      } = req.body;

      if (!name || !partnerEmail) {
        return res.status(400).json({
          success: false,
          message: "Name and partner email are required",
        });
      }

      const apiKey = await apiKeyService.createApiKey({
        name,
        partnerName: partnerName || "",
        partnerEmail,
        organization: organization || "",
        requestsPerDay: parseInt(requestsPerDay) || 100,
        expiresAt: expiresAt || null,
      });

      res.status(201).json({
        success: true,
        message: "API key created successfully",
        data: apiKey,
      });
    } catch (error) {
      console.error("Create API key error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create API key",
        error: error.message,
      });
    }
  }

  /**
   * Get all API keys
   * GET /api/admin/api-keys
   */
  async getAllApiKeys(req, res) {
    try {
      const { page = 1, limit = 20, status, search } = req.query;

      const query = {};

      if (status) {
        query.isActive = status === "active";
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { "partnerInfo.name": { $regex: search, $options: "i" } },
          { "partnerInfo.email": { $regex: search, $options: "i" } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [keys, total] = await Promise.all([
        ApiKey.find(query)
          .select("-keyHash")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        ApiKey.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        data: keys,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch API keys",
        error: error.message,
      });
    }
  }

  /**
   * Get API key by ID
   * GET /api/admin/api-keys/:keyId
   */
  async getApiKeyById(req, res) {
    try {
      const { keyId } = req.params;
      const apiKey = await apiKeyService.getApiKeyById(keyId);

      if (!apiKey) {
        return res.status(404).json({
          success: false,
          message: "API key not found",
        });
      }

      res.status(200).json({
        success: true,
        data: apiKey,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch API key",
        error: error.message,
      });
    }
  }

  /**
   * Update API key
   * PUT /api/admin/api-keys/:keyId
   */
  async updateApiKey(req, res) {
    try {
      const { keyId } = req.params;
      const updates = req.body;

      const apiKey = await apiKeyService.updateApiKey(keyId, updates);

      if (!apiKey) {
        return res.status(404).json({
          success: false,
          message: "API key not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "API key updated successfully",
        data: apiKey,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update API key",
        error: error.message,
      });
    }
  }

  /**
   * Revoke API key
   * DELETE /api/admin/api-keys/:keyId
   */
  async revokeApiKey(req, res) {
    try {
      const { keyId } = req.params;
      const apiKey = await apiKeyService.revokeApiKey(keyId);

      if (!apiKey) {
        return res.status(404).json({
          success: false,
          message: "API key not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "API key revoked successfully",
        data: apiKey,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to revoke API key",
        error: error.message,
      });
    }
  }

  /**
   * Get API key usage stats
   * GET /api/admin/api-keys/:keyId/stats
   */
  async getApiKeyStats(req, res) {
    try {
      const { keyId } = req.params;
      const { days = 30 } = req.query;

      const stats = await apiKeyService.getUsageStats(keyId);

      // Get usage over time
      const apiKey = await ApiKey.findOne({ keyId });
      if (!apiKey) {
        return res.status(404).json({
          success: false,
          message: "API key not found",
        });
      }

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));

      const usageOverTime = await mongoose.model("Evaluation").aggregate([
        {
          $match: {
            apiKeyId: apiKey._id,
            createdAt: { $gte: daysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          usageOverTime,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch API key stats",
        error: error.message,
      });
    }
  }
}

export default new ApiKeysController();
