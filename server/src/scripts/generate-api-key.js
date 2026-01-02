import dotenv from "dotenv";
import mongoose from "mongoose";
import apiKeyService from "../services/apiKey.service.js";
import connectDB from "../config/database.js";

dotenv.config();

/**
 * Script to generate a new API key
 * Usage: node src/scripts/generate-api-key.js
 */

async function generateKey() {
  try {
    await connectDB();

    console.log("📝 Enter API Key Details:");
    console.log("");

    // For MVP, we'll create a test key directly
    const keyData = {
      name: "Test API Key",
      partnerName: "Test Partner",
      partnerEmail: "partner@example.com",
      organization: "Test Organization",
      requestsPerDay: 100,
      expiresAt: null, // No expiration
    };

    console.log("Creating API key with details:");
    console.log(JSON.stringify(keyData, null, 2));
    console.log("");

    const result = await apiKeyService.createApiKey(keyData);

    console.log("✅ API Key Created Successfully!");
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 API KEY (Save this securely - shown only once!):");
    console.log("");
    console.log(`   ${result.apiKey}`);
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("Key Details:");
    console.log(`  Key ID: ${result.keyId}`);
    console.log(`  Name: ${result.name}`);
    console.log(`  Partner: ${result.partnerInfo.name}`);
    console.log(
      `  Rate Limit: ${result.rateLimit.requestsPerDay} requests/day`
    );
    console.log(`  Status: ${result.isActive ? "Active" : "Inactive"}`);
    console.log("");
    console.log("Usage:");
    console.log(`  Add this header to your API requests:`);
    console.log(`  X-API-Key: ${result.apiKey}`);
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating API key:", error);
    process.exit(1);
  }
}

generateKey();
