import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../config/constants.js";

// Use /tmp for serverless (Vercel) or os.tmpdir() for local
const getTempDir = () => {
  // Check if running in Vercel/serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp";
  }
  // For local development
  return path.join(process.cwd(), "uploads", "temp");
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp in serverless, local uploads otherwise
    const uploadDir = getTempDir();

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const isValidType = Object.keys(ALLOWED_FILE_TYPES).includes(file.mimetype);

  if (isValidType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: PDF, DOC, DOCX, JPG, PNG`
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10, // Maximum 10 files
  },
});

// Middleware to handle multiple file fields dynamically
const uploadMiddleware = (req, res, next) => {
  // Use .any() to accept any field names (since document types are dynamic)
  const uploadHandler = upload.any();

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size: ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Too many files. Maximum: 10 files",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // Custom errors (like file type validation)
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Reorganize files by fieldname for easier access
    if (req.files && req.files.length > 0) {
      req.files = req.files.reduce((acc, file) => {
        if (!acc[file.fieldname]) {
          acc[file.fieldname] = [];
        }
        acc[file.fieldname].push(file);
        return acc;
      }, {});
    }

    next();
  });
};

export default uploadMiddleware;
