import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import countriesRoutes from "./routes/countries.routes.js";
import evaluationsRoutes from "./routes/evaluations.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/countries", countriesRoutes);
app.use("/api/evaluations", evaluationsRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Multi-Country Visa Evaluation API",
    version: "1.0.0",
    endpoints: {
      countries: "/api/countries",
      evaluations: "/api/evaluations",
      health: "/health",
    },
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
