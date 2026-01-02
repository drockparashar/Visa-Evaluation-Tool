import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  storedPath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  extractedText: {
    type: String,
    default: "",
  },
});

const evaluationResultSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  maxScore: {
    type: Number,
    default: 85,
  },
  summary: {
    type: String,
    required: true,
  },
  breakdown: {
    documentCompleteness: Number,
    profileMatch: Number,
    aiAnalysis: Number,
  },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  evaluatedAt: {
    type: Date,
    default: Date.now,
  },
  evaluationTimeMs: Number,
});

const evaluationSchema = new mongoose.Schema(
  {
    evaluationId: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
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
      phone: String,
    },
    country: {
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    visaType: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    documents: [documentSchema],
    evaluation: evaluationResultSchema,
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    errorMessage: String,
    aiProcessing: {
      model: String,
      tokensUsed: Number,
      promptVersion: String,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique evaluation ID
evaluationSchema.pre("save", async function (next) {
  if (!this.evaluationId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.evaluationId = `EVAL-${date}-${random}`;
  }
  next();
});

// Index for faster queries
evaluationSchema.index({ "user.email": 1, createdAt: -1 });
evaluationSchema.index({ status: 1 });

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;
