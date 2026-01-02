import crypto from "crypto";
import ApiKeyRequest from "../models/ApiKeyRequest.js";
import apiKeyService from "../services/apiKey.service.js";

class PublicApiKeysController {
  /**
   * Request new API key (public endpoint)
   * POST /api/api-keys/request
   */
  async requestApiKey(req, res) {
    try {
      const { name, email, organization, useCase, website } = req.body;

      if (!name || !email || !useCase) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and use case are required",
        });
      }

      // Create API key immediately (no email verification)
      const apiKey = await apiKeyService.createApiKey({
        name: `${name} - ${organization || "Self-Service"}`,
        partnerName: name,
        partnerEmail: email,
        organization: organization || "",
        requestsPerDay: 100, // Default for self-service
        expiresAt: null,
      });

      // Save the request record for tracking
      const request = new ApiKeyRequest({
        name,
        email: email.toLowerCase(),
        organization: organization || "",
        useCase,
        website: website || "",
        status: "verified",
        apiKeyId: apiKey._id,
        verificationToken: "",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });

      await request.save();

      res.status(201).json({
        success: true,
        message: "API key created successfully!",
        data: {
          apiKey: apiKey.apiKey, // Only shown once
          keyId: apiKey.keyId,
          rateLimit: apiKey.rateLimit.requestsPerDay,
        },
      });
    } catch (error) {
      console.error("API key request error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create API key",
        error: error.message,
      });
    }
  }

  /**
   * Verify email and create API key
   * POST /api/api-keys/verify/:token
   */
  async verifyAndCreateKey(req, res) {
    try {
      const { token } = req.params;

      // Find request
      const request = await ApiKeyRequest.findOne({
        verificationToken: token,
        status: "pending",
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired verification link",
        });
      }

      // Check expiration
      if (request.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Verification link has expired",
        });
      }

      // Create API key
      const apiKey = await apiKeyService.createApiKey({
        name: `${request.name} - ${request.organization || "Self-Service"}`,
        partnerName: request.name,
        partnerEmail: request.email,
        organization: request.organization,
        requestsPerDay: 100, // Default for self-service
        expiresAt: null,
      });

      // Update request status
      request.status = "verified";
      request.apiKeyId = apiKey._id;
      await request.save();

      res.status(200).json({
        success: true,
        message: "API key created successfully",
        data: {
          apiKey: apiKey.apiKey, // Only shown once
          keyId: apiKey.keyId,
          rateLimit: apiKey.rateLimit.requestsPerDay,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify and create API key",
        error: error.message,
      });
    }
  }
}

export default new PublicApiKeysController();
