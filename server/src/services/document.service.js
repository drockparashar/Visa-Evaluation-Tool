import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp for serverless (Vercel) or local storage for development
const getBaseUploadDir = () => {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp";
  }
  return path.join(process.cwd(), "uploads");
};

class DocumentService {
  /**
   * Extract text from PDF file
   */
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error(`Error extracting text from PDF: ${error.message}`);
      return "";
    }
  }

  /**
   * Extract text from document based on file type
   */
  async extractText(filePath, mimeType) {
    try {
      if (mimeType === "application/pdf") {
        return await this.extractTextFromPDF(filePath);
      }

      // For other file types (doc, docx, images), return empty string for now
      // In production, you'd use libraries like mammoth for docx, tesseract for images
      return "";
    } catch (error) {
      console.error(`Error extracting text: ${error.message}`);
      return "";
    }
  }

  /**
   * Get document storage path
   */
  getStoragePath(evaluationId, filename) {
    const baseDir = getBaseUploadDir();
    const uploadDir = path.join(baseDir, "evaluations", evaluationId);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return path.join(uploadDir, filename);
  }

  /**
   * Delete all documents for an evaluation
   */
  async deleteEvaluationDocuments(evaluationId) {
    try {
      const baseDir = getBaseUploadDir();
      const dirPath = path.join(baseDir, "evaluations", evaluationId);

      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting documents: ${error.message}`);
      return false;
    }
  }

  /**
   * Process uploaded files and extract metadata
   */
  async processUploadedFiles(files, evaluationId) {
    const processedDocuments = [];

    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Get first file from array

      // Extract text if PDF
      const extractedText = await this.extractText(file.path, file.mimetype);

      processedDocuments.push({
        type: fieldName,
        originalName: file.originalname,
        storedPath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        extractedText,
      });
    }

    return processedDocuments;
  }

  /**
   * Validate file type
   */
  isValidFileType(mimetype) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    return allowedTypes.includes(mimetype);
  }

  /**
   * Get file extension from mimetype
   */
  getFileExtension(mimetype) {
    const extensions = {
      "application/pdf": ".pdf",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
      "image/jpeg": ".jpg",
      "image/png": ".png",
    };

    return extensions[mimetype] || "";
  }
}

export default new DocumentService();
