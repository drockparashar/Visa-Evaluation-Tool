import mongoose from "mongoose";

const apiKeyRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    organization: String,
    useCase: {
      type: String,
      required: true,
    },
    website: String,
    verificationToken: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
apiKeyRequestSchema.index({ verificationToken: 1 });
apiKeyRequestSchema.index({ email: 1 });
apiKeyRequestSchema.index({ status: 1 });
apiKeyRequestSchema.index({ expiresAt: 1 });

const ApiKeyRequest = mongoose.model("ApiKeyRequest", apiKeyRequestSchema);

export default ApiKeyRequest;
