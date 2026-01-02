import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    keyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    keyHash: {
      type: String,
      required: true,
    },
    partnerInfo: {
      name: String,
      email: String,
      organization: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rateLimit: {
      requestsPerDay: {
        type: Number,
        default: 100,
      },
    },
    usage: {
      totalRequests: {
        type: Number,
        default: 0,
      },
      lastUsedAt: Date,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
apiKeySchema.index({ isActive: 1 });
apiKeySchema.index({ expiresAt: 1 });

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
